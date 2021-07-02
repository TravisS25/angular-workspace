import {
    Component,
    OnInit,
    Input,
    ViewChild,
    EventEmitter,
    ComponentFactoryResolver,
    ViewChildren,
    QueryList,
    AfterViewInit,
    ComponentRef,
    ChangeDetectorRef,
    OnDestroy,
    OnChanges, SimpleChanges, ɵɵCopyDefinitionFeature
} from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Table, SortIcon, SortableColumn } from 'primeng/table'
import { Message, LazyLoadEvent, MessageService, SortEvent, MenuItem, SelectItem } from 'primeng/api';
import {
    FilterData,
    Column,
    BaseTableConfig,
    State,
    FilterDescriptor,
    GroupDescriptor,
    SortDescriptor,
    FieldName,
    BoolList,
    ExportType,
    RowExpansionItemsI,
    BaseTableItemsI,
    BaseTableEvent,
    MultiSelectOptions,
    APIConfig,
    ParamConfig,
    BaseColumnItems,
    ColumnEntity,
    BaseColumnItemsI,
    EditEventConfig,
} from '../../table-api';
import { DialogService } from 'primeng/dynamicdialog';
import { DynamicBodyCellDirective } from '../../directives/dynamic-body-cell.directive';
import { DynamicExpansionDirective } from '../../directives/dynamic-expansion.directive';
import { Checkbox } from 'primeng/checkbox';
import { DynamicCaptionDirective } from '../../directives/dynamic-caption.directive';
import { Subscription, Subscribable, Subject } from 'rxjs';
import { DynamicColumnFilterDirective } from '../../directives/dynamic-column-filter.directive';
import { deepCopyColumn } from '../../copy-util';
import { ColumnCheckboxDirective } from '../../directives/column-checkbox.directive';
import { SortIconComponent } from '../filter-components/sort-icon/sort-icon.component';
import { ComponentFactory } from '@angular/core';
import { DynamicOutputTemplateDirective } from '../../directives/dynamic-output-template.directive';
import { DynamicInputTemplateDirective } from '../../directives/dynamic-input-template.directive';

@Component({
    selector: 'app-base-table',
    templateUrl: './base-table.component.html',
    styleUrls: ['./base-table.component.scss'],
})
export class BaseTableComponent implements OnInit, AfterViewInit, OnDestroy {
    // _rowExpandIdx is used to keep track of the experimental "expand all rows" functionality
    // This variable simply keeps track of which current row should be expanded
    private _rowExpandIdx: number = 0;

    // _hiddenColumnFilters is used to keep track of all initial hidden column filters
    // set in the column api when table is first loaded so whenever a user clicks the 
    // "Clear Filter" button, we can reset to the same initial state 
    private _hiddenColumnFilters: string[] = [];

    // _hiddenColumns keeps track of all current hidden columns
    // This is mainly used to help set the value of the "visibleColumns" variable as in:
    // "this.visibleColumns = this.columnCheckboxes.length - this._hiddenColumns.length;"
    private _hiddenColumns: string[] = [];

    // _updateBodyCellComponents is used as a "hack flag" as subscribing to the body
    // cell events triggers multiple times on initial load on new data so this will be 
    // set true on new data and once triggered the first time, this will be set to false
    // until we filter for more data
    private _updateBodyCellComponents: boolean = false;

    // _updateColumnFilter is used as a "hack flag" as subscribing to the column filter
    // events triggers when retrieving new data
    // This variable will be set to false once we get initial data and will never need
    // to be updated again
    private _updateColumnFilter: boolean = true;

    // _expansionLen is a "hack variable" for the expansion of a table
    // It keeps track of total number of expanded rows and helps with dynamically
    // creating row expansions
    private _expansionLen: number = 0;

    // _tableInit is flag used to keep track if the current table has be fully initialized or not
    // This will be set true once the table is fully rendered and won't change again
    // There are various variables that depend on this to function
    private _tableInit: boolean = false;

    // _cellSubs is used to keep track of subscriptions of input templates for cell editing
    private _cellSubs: Subscription[] = [];

    // _clonedRowData is used to keep track of edited rows by user
    // The key value used is the one set in BaseTableConfig#dataKey
    private _clonedRowData: { [s: string]: any; } = {};

    // _sortMap keeps tracks of column headers and their sort order
    // The key should represent the column field and value is the number
    // of times the header has been clicked to "cycle" through different
    // sort options etc. "asc", "desc", "neutral"
    //
    // The reason for having this variable, which is used in the "onSortChange"
    // function, is a work around the default functionality of the primeng table 
    // The default primeng table sort functionality is once you
    // start sorting a column, it can't be "unsorted" or set back to a neutral state
    // It continues to flip between "asc" and "desc" and never back to neutral
    private _sortMap: Map<string, number> = new Map<string, number>();

    // _createSub is used to keep a reference to any modal create subscription
    // to be destroyed once the component is destroyed
    private _createSub: Subscription;

    // _subs is used to keep a reference to all subscriptions within table
    private _subs: Subscription[] = [];

    // _bodyCellSubs is used to keep reference to explicitly body cell subscriptions
    // and will properly unsubscribe from them when new data is loaded into table
    private _bodyCellSubs: Subscription[] = [];

    // _onTableFilterEvent is used by other components of the table like caption,
    // column filter and body cell rows and will be emitted by table whenever
    // new data is loaded into the table via column filter or pagination
    private _onTableFilterEvent: EventEmitter<any> = new EventEmitter<any>();

    // _onClearFiltersEvent is used by other components of the table like caption,
    // column filter and body cell rows and will be emitted by table whenever
    // the "Clear Filter Button" is triggered
    private _onClearFiltersEvent: EventEmitter<any> = new EventEmitter<any>();

    // _onSortEvent is triggered whenever a sort event occurs on a column
    private _onSortEvent: EventEmitter<any> = new EventEmitter<any>();

    // columnFilterCrs keeps a list of references to dynamically created column filters
    // components which can be modified through different events and will be destroyed on 
    // component destruction
    public columnFilterCrs: ComponentRef<BaseColumnItemsI>[] = [];

    // rowExpansionCrs keeps a list of references to dynamically created expanded row
    // components which can be modified through different events and will be destroyed on 
    // component destruction
    public rowExpansionCrs: ComponentRef<RowExpansionItemsI>[] = [];

    // bodyCellCrs keeps a list of references to dynamically created body cell 
    // which can be modified through different events and will be destroyed on 
    // component destruction
    public bodyCellCrs: ComponentRef<BaseColumnItemsI>[] = [];

    // outputTemplateCrs keeps a list of references to dynamically created output template
    // which can be modified through different events and will be destroyed on 
    // component destruction
    //public outputTemplateCrs: ComponentRef<BaseColumnItemsI>[] = [];

    // captionCr keeps a reference to dynamically created caption component which can be 
    // modified through different events and will be destroyed on component destruction
    public captionCr: ComponentRef<BaseTableItemsI>;

    // selectedColumns is the currently selected columns in table caption
    public selectedColumns: any[] = [];

    // columnOptions are the column fields that will be displayed in the dropdown
    // list in caption table
    // The columns that will be listed in dropdown are the ones that have
    // Column#showColumnOption set to true(default)
    public columnOptions: SelectItem[] = [];

    // This should NEVER be set manually as it is used as a "flag"
    // to indicate that current table is an inner table if set
    // and to use this info to fill current table
    @Input() public outerData: any;

    // renderCallback is used for the expirimental expand all rows button
    // This is sent to inner table when current table expands row and will 
    // be triggered when inner view is fully initialized and will move 
    // on to the next row to expand
    //
    // This is a bit of a hack as we can't simply loop through all rows in table
    // and call expand on each row since the rendering of the inner table is 
    // not immediate because of its dynamic rendering behavior
    //
    // Currently the expand row button is disabled even though it works
    // properly because there is a huge delay in all the rows actually expanding
    // on the UI thread which causes user not able to click on anything for
    // a few seconds until it's done
    // This comment should be deleted once a work around is found
    @Input() public renderCallback: EventEmitter<any> = new EventEmitter<any>();

    // config is variable that stores all configuration for table
    @Input() public config: BaseTableConfig;

    @ViewChild('dt', { static: false }) public dt: Table;
    @ViewChild(DynamicCaptionDirective, { static: false })
    public headerCaptionDir: DynamicCaptionDirective;
    @ViewChildren(DynamicExpansionDirective)
    public expansionDirs: QueryList<DynamicExpansionDirective>;
    @ViewChildren(DynamicBodyCellDirective)
    public bodyCellDirs: QueryList<DynamicBodyCellDirective>;
    @ViewChildren(DynamicInputTemplateDirective)
    public inputTemplateDirs: QueryList<DynamicInputTemplateDirective>;
    @ViewChildren(DynamicColumnFilterDirective)
    public columnFilterDirs: QueryList<DynamicColumnFilterDirective>;
    @ViewChildren(ColumnCheckboxDirective) public columnCheckboxes: QueryList<ColumnCheckboxDirective>;
    @ViewChildren(SortIconComponent) public sortIcons: QueryList<SortIconComponent>;
    @ViewChildren(SortableColumn) public sortColumns: QueryList<SortableColumn>;

    // defaultProperty is the default property used to be set for primeng's table "dataKey" property
    public defaultProperty: string = "id";
    public showMessage = true;
    public msgs: Message[] = [];

    // exportItems is used to display multiple export format options within a single button
    public exportItems: MenuItem[];

    // visibleColumns keeps track of the total number of visible columns
    // This is needed for when we use row expansion, the UI needs to know how
    // many columns are in the "above" table in order to render correctly
    public visibleColumns: number = 0;

    public showNoRecordsLabel: boolean = false;

    // state keeps track of the current table's filter state and is the info that is 
    // sent to the server whenever a column filter is used or pagination occurs
    public state: State = {
        skip: 0,
        take: 20,
        filter: {
            logic: 'and',
            filters: new Array<FilterDescriptor>()
        },
        sort: new Array<SortDescriptor>(),
        group: new Array<GroupDescriptor>(),
    };

    constructor(
        public cdr: ChangeDetectorRef,
        public cfr: ComponentFactoryResolver,
        public http: HttpClient,
        public router: Router,
        public route: ActivatedRoute,
        public dialog: DialogService,
        public messageService: MessageService,
    ) { }

    ///////////////////////////////////////////
    // INIT DEFAULT VALUES
    ///////////////////////////////////////////

    private init() {
        this.initValues();
    }

    private initAfterView() {
        this.initDynamicComponents()
        this.initDefaultTableValues();
        this.saveHiddenColumns();
        this.saveHiddenColumnFilters();
        this.refresh();
        this.cdr.detectChanges();
    }

    // initValues takes the passed config and sets default values
    // if the values are undefined
    private initValues() {
        if (this.config.showCaption == undefined) {
            this.config.showCaption = true;
        }
        if (this.config.showNoRecordsLabel == undefined) {
            this.config.showNoRecordsLabel = true;
        }
        if (this.config.hasColGroup == undefined) {
            this.config.hasColGroup = true;
        }
        if (this.config.exportConfig != undefined) {
            if (this.config.exportConfig.fieldsParam == undefined) {
                this.config.exportConfig.fieldsParam = 'headers';
            }

            this.exportItems = [];

            if (this.config.exportConfig.exportFormats.csv != undefined) {
                this.config.exportConfig.exportFormats.csv.command = (event: any) => {
                    this.exportButton(ExportType.csv);
                }
                this.exportItems.push(this.config.exportConfig.exportFormats.csv);
            }
            if (this.config.exportConfig.exportFormats.xls != undefined) {
                this.config.exportConfig.exportFormats.xls.command = (event: any) => {
                    this.exportButton(ExportType.xls);
                }
                this.exportItems.push(this.config.exportConfig.exportFormats.xls);
            }
            if (this.config.exportConfig.exportFormats.xlsx != undefined) {
                this.config.exportConfig.exportFormats.xlsx.command = (event: any) => {
                    this.exportButton(ExportType.xlsx);
                }
                this.exportItems.push(this.config.exportConfig.exportFormats.xlsx);
            }
        }

        if (this.config.autoSearch == undefined) {
            this.config.autoSearch = true;
        }
        if (this.config.scrollHeight == undefined) {
            this.config.scrollHeight = '550px';
        }
        if (this.config.dataKey == undefined) {
            this.config.dataKey = this.defaultProperty;
        }
        if (this.config.rows == undefined) {
            this.config.rows = 20;
        }
        if (this.config.showCurrentPageReport == undefined) {
            this.config.showCurrentPageReport = true;
        }
        if (this.config.rowsPerPageOptions == undefined) {
            this.config.rowsPerPageOptions = [20, 50, 100];
        }
        if (this.config.loading == undefined) {
            this.config.loading = true;
        }
        if (this.config.paginator == undefined) {
            this.config.paginator = true;
        }
        if (this.config.paginatorPosition == undefined) {
            this.config.paginatorPosition = 'bottom';
        }
        if (this.config.lazy == undefined) {
            this.config.lazy = true;
        }
        if (this.config.scrollable == undefined) {
            this.config.scrollable = true;
        }
        if (this.config.currentPageReportTemplate == undefined) {
            this.config.currentPageReportTemplate = 'Showing {first} to {last} of {totalRecords} entries';
        }
        if (this.config.resizableColumns == undefined) {
            this.config.resizableColumns = false;
        }
        if (this.config.columnResizeMode == undefined) {
            this.config.columnResizeMode = 'fit';
        }

        let pCfg: ParamConfig = {
            take: 'take',
            skip: 'skip',
            filters: 'filters',
            sorts: 'sorts',
        }

        if (this.config.paramConfig == undefined) {
            this.config.paramConfig = pCfg;
        } else {
            if (this.config.paramConfig.skip == undefined) {
                this.config.paramConfig.skip = pCfg.skip;
            }
            if (this.config.paramConfig.take == undefined) {
                this.config.paramConfig.take = pCfg.take;
            }
            if (this.config.paramConfig.filters == undefined) {
                this.config.paramConfig.filters = pCfg.filters;
            }
            if (this.config.paramConfig.sorts == undefined) {
                this.config.paramConfig.sorts = pCfg.sorts;
            }
        }

        if (this.config.getState != undefined) {
            this.state = this.config.getState(this.outerData);
        }
        if (this.config.resetEditedRowsOnTableFilter == undefined) {
            this.config.resetEditedRowsOnTableFilter = true;
        }
    }

    // initDefaultTableValues initializes default values for table 
    // if not provided by config
    private initDefaultTableValues() {
        this.dt.scrollHeight = this.config.scrollHeight;
        this.dt.dataKey = this.config.dataKey;
        this.dt.rows = this.config.rows
        this.dt.showCurrentPageReport = this.config.showCurrentPageReport;
        this.dt.rowsPerPageOptions = this.config.rowsPerPageOptions;
        this.dt.loading = this.config.loading;
        this.dt.paginator = this.config.paginator;
        this.dt.lazy = this.config.lazy;
        this.dt.scrollable = this.config.scrollable;
        this.dt.currentPageReportTemplate = this.config.currentPageReportTemplate;

        let columns: Column[] = [];

        for (let i = 0; i < this.config.columns.length; i++) {
            let col: Column = deepCopyColumn(this.config.columns[i])

            if (col.sort != undefined) {
                this._sortMap.set(col.sort.sortField, 0);
                col.sort.sortOrder = 'none';
            }
            if (col.renderColumnContent == undefined) {
                col.renderColumnContent = true;
            }
            if (col.showColumnOption == undefined) {
                col.showColumnOption = true;
            }
            if (col.showColumnOption) {
                this.columnOptions.push({
                    value: col.field,
                    label: col.header,
                });

                if (!col.hideColumn) {
                    this.selectedColumns.push(col.field);
                }
            }

            columns.push(col);
        }

        this.dt.columns = columns
        this.cdr.detectChanges();
    }

    ///////////////////////////////////////////
    // INIT COLUMN COMPONENTS
    ///////////////////////////////////////////

    // initExpansionComponents initializes row expansion component reference
    // and creates component if set by api
    private initExpansionComponents() {
        this._subs.push(
            this.expansionDirs.changes.subscribe(val => {
                //console.log("expansion dir");
                //console.log(val);

                if (val.last && this.config.rowExpansion && this._expansionLen < val.length) {
                    //console.log('expansion being created')
                    const e = val.last as DynamicExpansionDirective
                    const cf = this.cfr.resolveComponentFactory(
                        this.config.rowExpansion.component,
                    );

                    const cr = e.viewContainerRef.createComponent(cf);
                    cr.instance.outerData = e.outerData;
                    cr.instance.renderCallback = e.renderCallback;
                    cr.instance.config = this.config.rowExpansion.config;
                    this.rowExpansionCrs.push(cr);
                    this.cdr.detectChanges();
                }

                this._expansionLen = val.length;
            })
        )
    }

    // initColumnFilterComponents initializes column filter component references
    // and creates components if set by column api
    private initColumnFilterComponents() {
        this._subs.push(
            this.columnFilterDirs.changes.subscribe(val => {
                if (this._updateColumnFilter) {
                    let results = val._results as DynamicColumnFilterDirective[];
                    results.forEach((item) => {
                        let columns: Column[] = this.dt.columns

                        const cf = this.cfr.resolveComponentFactory(
                            columns[item.colIdx].columnFilter.component,
                        );

                        const cr = item.viewContainerRef.createComponent(cf);
                        cr.instance.baseTable = this;
                        cr.instance.colIdx = item.colIdx;

                        if (columns[item.colIdx].columnFilter != undefined) {
                            cr.instance.field = columns[item.colIdx].columnFilter.field;
                            cr.instance.value = columns[item.colIdx].columnFilter.value;
                            cr.instance.selectedValue = columns[item.colIdx].columnFilter.selectedValue;
                            cr.instance.config = columns[item.colIdx].columnFilter.config;
                            cr.instance.isColumnFilter = true;

                            cr.instance.processCaptionEvent = columns[item.colIdx].columnFilter.processCaptionEvent;
                            cr.instance.processTableFilterEvent = columns[item.colIdx].columnFilter.processTableFilterEvent;
                            cr.instance.processColumnFilterEvent = columns[item.colIdx].columnFilter.processColumnFilterEvent;
                            cr.instance.processBodyCellEvent = columns[item.colIdx].columnFilter.processBodyCellEvent;
                            cr.instance.processClearFiltersEvent = columns[item.colIdx].columnFilter.processClearFiltersEvent;
                            cr.instance.processSortEvent = columns[item.colIdx].columnFilter.processSortEvent;

                            if (columns[item.colIdx].columnFilter.operator != undefined) {
                                cr.instance.operator = columns[item.colIdx].columnFilter.operator;
                            }
                        }

                        cr.instance.onColumnFilterEvent = new EventEmitter<any>();
                        cr.instance.onBodyCellEvent = new EventEmitter<any>();
                        cr.instance.onCaptionEvent = new EventEmitter<any>();
                        cr.instance.onTableFilterEvent = new EventEmitter<any>();
                        cr.instance.onClearFiltersEvent = new EventEmitter<any>();
                        cr.instance.onSortEvent = new EventEmitter<any>();
                        this.columnFilterCrs.push(cr);
                    });
                }

                this._updateColumnFilter = false;
            })
        )
    }

    // initCellComponents initializes cell component references and creates component
    private initCellComponents() {
        this._subs.push(
            this.bodyCellDirs.changes.subscribe(val => {
                console.log('change within body cell')
                console.log(val)
                if (this._updateBodyCellComponents) {
                    console.log('body cell dirs')

                    // If table has already been initialized, destroy current component references
                    // and assign bodyCellCrs to empty array;
                    if (this._tableInit) {
                        this.bodyCellCrs.forEach(item => {
                            item.destroy();
                        })
                        this.bodyCellCrs = [];
                    }

                    let results = val._results as DynamicBodyCellDirective[];
                    results.forEach(item => {
                        let columns: Column[] = this.dt.columns;
                        const bc = columns[item.colIdx].bodyCell;
                        const cf = this.cfr.resolveComponentFactory(bc.component);

                        if (cf != undefined) {
                            // console.log('body dir col idx with cf ');
                            // console.log(item.colIdx);
                            // console.log(item.isInputTemplate);
                            const cr = item.viewContainerRef.createComponent(cf);
                            cr.instance.baseTable = this;
                            cr.instance.colIdx = item.colIdx;
                            cr.instance.rowIdx = item.rowIdx;
                            cr.instance.rowData = item.rowData;
                            cr.instance.isColumnFilter = false;
                            cr.instance.isInputTemplate = false;

                            if (bc.getSelectedValue != undefined) {
                                cr.instance.selectedValue = bc.getSelectedValue(item.rowData);
                            } else {
                                cr.instance.selectedValue = bc.selectedValue;
                            }

                            cr.instance.config = bc.config;
                            cr.instance.field = bc.field;
                            cr.instance.value = bc.value;
                            cr.instance.processRowData = bc.processRowData;
                            cr.instance.processCaptionEvent = bc.processCaptionEvent;
                            cr.instance.processTableFilterEvent = bc.processTableFilterEvent;
                            cr.instance.processColumnFilterEvent = bc.processColumnFilterEvent;
                            cr.instance.processBodyCellEvent = bc.processBodyCellEvent;
                            cr.instance.processClearFiltersEvent = bc.processClearFiltersEvent;
                            cr.instance.processSortEvent = bc.processSortEvent;

                            cr.instance.onBodyCellEvent = new EventEmitter<any>();
                            cr.instance.onColumnFilterEvent = new EventEmitter<any>();
                            cr.instance.onCaptionEvent = new EventEmitter<any>();
                            cr.instance.onTableFilterEvent = new EventEmitter<any>();
                            cr.instance.onClearFiltersEvent = new EventEmitter<any>();
                            this.bodyCellCrs.push(cr);
                        }
                    });

                    // If table has already been initialized, unsubscribe from current
                    // body cell subscriptions and assign "_bodyCellSubs" to empty array
                    // and then initialize new body cell component references 
                    if (this._tableInit) {
                        this._bodyCellSubs.forEach(item => {
                            item.unsubscribe();
                        })
                        this._bodyCellSubs = [];
                        this.initBodyCellCrEvents()
                    }

                    this.cdr.detectChanges();
                    this._updateBodyCellComponents = false;
                }
            }),
            this.inputTemplateDirs.changes.subscribe(val => {
                let results = val._results as DynamicInputTemplateDirective[];

                results.forEach(item => {
                    let columns: Column[] = this.dt.columns;
                    const bc = columns[item.colIdx].editModeConfig.inputTemplate as ColumnEntity
                    const cf = this.cfr.resolveComponentFactory(bc.component);

                    console.log('sdfsdfs')
                    console.log(item.colIdx);

                    if (cf != undefined) {
                        const cr = item.viewContainerRef.createComponent(cf);
                        cr.instance.baseTable = this;
                        cr.instance.colIdx = item.colIdx;
                        cr.instance.rowIdx = item.rowIdx;
                        cr.instance.rowData = item.rowData;
                        cr.instance.field = item.field
                        cr.instance.isColumnFilter = false;
                        cr.instance.isInputTemplate = true;

                        if (bc.getSelectedValue != undefined) {
                            cr.instance.selectedValue = bc.getSelectedValue(item.rowData);
                        } else {
                            cr.instance.selectedValue = bc.selectedValue;
                        }

                        cr.instance.config = bc.config;
                        cr.instance.field = bc.field;
                        cr.instance.value = bc.value;
                        cr.instance.processRowData = bc.processRowData;
                        cr.instance.processCaptionEvent = bc.processCaptionEvent;
                        cr.instance.processTableFilterEvent = bc.processTableFilterEvent;
                        cr.instance.processColumnFilterEvent = bc.processColumnFilterEvent;
                        cr.instance.processBodyCellEvent = bc.processBodyCellEvent;
                        cr.instance.processClearFiltersEvent = bc.processClearFiltersEvent;
                        cr.instance.processSortEvent = bc.processSortEvent;

                        cr.instance.onBodyCellEvent = new EventEmitter<any>();
                        cr.instance.onColumnFilterEvent = new EventEmitter<any>();
                        cr.instance.onCaptionEvent = new EventEmitter<any>();
                        cr.instance.onTableFilterEvent = new EventEmitter<any>();
                        cr.instance.onClearFiltersEvent = new EventEmitter<any>();

                        this._cellSubs.push(
                            cr.instance.editChange.subscribe(r => {
                                if (this.config.localStorageKeyForEditedRows != undefined) {
                                    window.localStorage.setItem(
                                        this.config.localStorageKeyForEditedRows,
                                        JSON.stringify(this._clonedRowData)
                                    )
                                }

                                this._clonedRowData[this.config.dataKey] = r;
                                this.dt.value[item.rowIdx] = r
                            })
                        )
                    }

                    this.cdr.detectChanges();
                });
            })
        )
    }

    // initCaptionComponent initializes and creates caption component if set by config
    private initCaptionComponent() {
        if (this.config.caption != undefined && this.config.caption != null) {
            //console.log('caption dir')
            const cf = this.cfr.resolveComponentFactory(
                this.config.caption.component,
            );

            const cr = this.headerCaptionDir.viewContainerRef.createComponent(cf);
            cr.instance.config = this.config.caption.config;
            cr.instance.baseTable = this;

            cr.instance.onCaptionEvent = new EventEmitter<any>();
            cr.instance.onBodyCellEvent = new EventEmitter<any>();
            cr.instance.onColumnFilterEvent = new EventEmitter<any>();
            cr.instance.onTableFilterEvent = new EventEmitter<any>();
            cr.instance.onClearFiltersEvent = new EventEmitter<any>();
            this.captionCr = cr;
        }
    }

    // initCRSEvents is in charge of taking all of the initialized components
    // references and subscribing them all to each other's events and having
    // ability for all parts of the table to listen to each other 
    private initCRSEvents() {
        let columns: Column[] = this.dt.columns;

        // subscribing all components to table filter event, which occurs
        // whenever new data is written to table via column filter,
        // pagination, etc.
        this._subs.push(
            this._onTableFilterEvent.subscribe(r => {
                for (let i = 0; i < columns.length; i++) {
                    if (columns[i].processTableFilterEvent != undefined) {
                        columns[i].processTableFilterEvent(r, this);
                    }
                }
                for (let i = 0; i < this.columnFilterCrs.length; i++) {
                    if (this.columnFilterCrs[i].instance.onTableFilterEvent != undefined) {
                        this.columnFilterCrs[i].instance.onTableFilterEvent.emit(r);
                    }
                }
                for (let i = 0; i < this.bodyCellCrs.length; i++) {
                    if (this.bodyCellCrs[i].instance.onTableFilterEvent != undefined) {
                        this.bodyCellCrs[i].instance.onTableFilterEvent.emit(r);
                    }
                }

                if (this.captionCr != undefined) {
                    this.captionCr.instance.onTableFilterEvent.emit(r);
                }
                if (this.config.processTableFilterEvent != undefined) {
                    this.config.processTableFilterEvent(r, this);
                }
            })
        );

        // subscribing all components to clear filters event, which
        // occurs whenever a user clicks the "Clear Filters" button
        this._subs.push(
            this._onClearFiltersEvent.subscribe(r => {
                for (let i = 0; i < columns.length; i++) {
                    if (columns[i].processClearFiltersEvent != undefined) {
                        columns[i].processClearFiltersEvent(r, this);
                    }
                }

                for (let i = 0; i < this.columnFilterCrs.length; i++) {
                    if (this.columnFilterCrs[i].instance.onTableFilterEvent != undefined) {
                        this.columnFilterCrs[i].instance.onClearFiltersEvent.emit(r);
                    }
                }
                for (let i = 0; i < this.bodyCellCrs.length; i++) {
                    if (this.bodyCellCrs[i].instance.onTableFilterEvent != undefined) {
                        this.bodyCellCrs[i].instance.onClearFiltersEvent.emit(r);
                    }
                }

                if (this.captionCr != undefined) {
                    this.captionCr.instance.onClearFiltersEvent.emit(r);
                }

                if (this.config.processClearFiltersEvent != undefined) {
                    this.config.processClearFiltersEvent(r, this);
                }
            })
        )

        // subscribing all components to sort event which occurs when user sorts by field
        this._subs.push(
            this._onSortEvent.subscribe(r => {
                for (let i = 0; i < columns.length; i++) {
                    if (columns[i].processClearFiltersEvent != undefined) {
                        columns[i].processSortEvent(r, this);
                    }
                }

                for (let i = 0; i < this.columnFilterCrs.length; i++) {
                    if (this.columnFilterCrs[i].instance.onTableFilterEvent != undefined) {
                        this.columnFilterCrs[i].instance.onClearFiltersEvent.emit(r);
                    }
                }
                for (let i = 0; i < this.bodyCellCrs.length; i++) {
                    if (this.bodyCellCrs[i].instance.onTableFilterEvent != undefined) {
                        this.bodyCellCrs[i].instance.onClearFiltersEvent.emit(r);
                    }
                }

                if (this.captionCr != undefined) {
                    this.captionCr.instance.onClearFiltersEvent.emit(r);
                }

                if (this.config.processClearFiltersEvent != undefined) {
                    this.config.processClearFiltersEvent(r, this);
                }
            })
        )

        // subscribing all components to caption event which occurs whenever
        // user emits some activity within caption.  onCaptionEvent is mainly 
        // triggered by custom emits
        if (this.captionCr != undefined) {
            this._subs.push(
                this.captionCr.instance.onCaptionEvent.subscribe(r => {
                    for (let i = 0; i < columns.length; i++) {
                        if (columns[i].processCaptionEvent != undefined) {
                            columns[i].processCaptionEvent(r, this);
                        }
                    }
                    for (let i = 0; i < this.columnFilterCrs.length; i++) {
                        if (this.columnFilterCrs[i].instance.onCaptionEvent != undefined) {
                            this.columnFilterCrs[i].instance.onCaptionEvent.emit(r);
                        }
                    }
                    for (let i = 0; i < this.bodyCellCrs.length; i++) {
                        if (this.bodyCellCrs[i].instance.onCaptionEvent != undefined) {
                            this.bodyCellCrs[i].instance.onCaptionEvent.emit(r);
                        }
                    }

                    if (this.config.processCaptionEvent != undefined) {
                        this.config.processCaptionEvent(r, this);
                    }
                })
            );
        }

        // subscribing all components to column filter events which occurs whenever
        // user changes filtering for particular column
        for (let i = 0; i < this.columnFilterCrs.length; i++) {
            this._subs.push(
                this.columnFilterCrs[i].instance.onColumnFilterEvent.subscribe(r => {
                    for (let t = 0; t < columns.length; t++) {
                        if (columns[t].columnFilter != undefined && columns[t].columnFilter.field == this.columnFilterCrs[i].instance.field) {

                            if (columns[t].columnFilter.field == undefined ||
                                columns[t].columnFilter.field == null ||
                                columns[t].columnFilter.field == '') {
                                console.warn(
                                    'Warning!!! Your columnFilter "field" property is blank on index "' + t + '" of your columns array.  ' +
                                    'This can effect your "processOnColumnFilter" function if another field is also blank',
                                )
                            }

                            if (columns[t].processColumnFilterEvent != undefined) {
                                columns[t].processColumnFilterEvent(r, this);
                            }
                        }
                    }

                    for (let t = 0; t < this.bodyCellCrs.length; t++) {
                        if (this.bodyCellCrs[t].instance.colIdx == this.columnFilterCrs[i].instance.colIdx) {
                            if (this.bodyCellCrs[t].instance.onColumnFilterEvent != undefined) {
                                this.bodyCellCrs[t].instance.onColumnFilterEvent.emit(r);
                            }
                        }
                    }

                    if (this.captionCr != undefined) {
                        this.captionCr.instance.onColumnFilterEvent.emit(r);
                    }

                    if (this.config.processColumnFilterEvent != undefined) {
                        this.config.processColumnFilterEvent(r, this);
                    }

                    let event = r as FilterDescriptor;

                    console.log('event filter')
                    console.log(event)

                    if (event.field !== '' && event.field !== undefined && event.field !== null) {
                        let filterIdx = -1;
                        let filters = this.state.filter.filters as FilterDescriptor[];

                        console.log('filter before stuff')
                        console.log(filters)

                        for (let i = 0; i < filters.length; i++) {
                            if (filters[i].field == event.field) {
                                filterIdx = i;
                            }
                        }

                        if (filterIdx > -1) {
                            this.state.filter.filters.splice(filterIdx, 1);
                        }

                        console.log('filter after splice')
                        console.log(filters)

                        if (Array.isArray(event.value)) {
                            let arrayVal = event.value as any[];

                            if (arrayVal.length != 0) {
                                this.state.filter.filters.push(event);
                            }
                        } else {
                            if (event.value !== undefined && event.value !== null && event.value !== "") {
                                this.state.filter.filters.push(event);
                            } else {
                                if (event.operator == 'isnull' || event.operator == 'isnotnull') {
                                    this.state.filter.filters.push({
                                        field: event.field,
                                        operator: event.operator,
                                    });
                                }
                            }
                        }

                        console.log('filter at the end')
                        console.log(filters)

                        if (this.config.autoSearch) {
                            this.update();
                        }
                    }
                })
            );
        }

        this.initBodyCellCrEvents()
    }

    // initBodyCellCrEvents subscribes all components to body cell events which occur
    // when user emits event from body cell, which is usually a custom action
    //
    // The reason this is a seperate function and not used within our "initCRSEvents" function
    // is because this needs to be reused everytime our table gets new data
    private initBodyCellCrEvents() {
        for (let i = 0; i < this.bodyCellCrs.length; i++) {
            this._bodyCellSubs.push(
                this.bodyCellCrs[i].instance.onBodyCellEvent.subscribe(r => {
                    for (let t = 0; t < this.columnFilterCrs.length; t++) {
                        if (this.columnFilterCrs[t].instance.colIdx == this.bodyCellCrs[i].instance.colIdx) {
                            if (this.columnFilterCrs[t].instance.onBodyCellEvent != undefined) {
                                this.columnFilterCrs[t].instance.onBodyCellEvent.emit(r);
                            }
                        }
                    }
                    // for (let t = 0; t < this.outputTemplateCrs.length; t++) {
                    //     if (this.outputTemplateCrs[t].instance.colIdx == this.bodyCellCrs[i].instance.colIdx) {
                    //         if (this.outputTemplateCrs[t].instance.onBodyCellEvent != undefined) {
                    //             this.outputTemplateCrs[t].instance.onBodyCellEvent.emit(r);
                    //         }
                    //     }
                    // }

                    let cols: Column[] = this.dt.columns;
                    let cfg: BaseTableEvent = r;

                    for (let i = 0; i < cols.length; i++) {
                        if (cols[i].bodyCell != undefined && cols[i].bodyCell.field == cfg.eventFieldName) {
                            if (cols[i].processBodyCellEvent != undefined) {
                                cols[i].processBodyCellEvent(r, this);
                            }
                        }
                    }

                    if (this.captionCr != undefined) {
                        this.captionCr.instance.onBodyCellEvent.emit(r);
                    }
                    if (this.config.processBodyCellEvent != undefined) {
                        this.config.processBodyCellEvent(r, this);
                    }
                })
            );
        }
    }

    private initDynamicComponents() {
        this.initCaptionComponent();
        this.initExpansionComponents();
        this.initColumnFilterComponents();
        this.initCellComponents();
    }

    ///////////////////////////////////////////
    // FILTER FUNCTIONALITY
    ///////////////////////////////////////////

    // saveHiddenColumnFilters is used to gather initial hidden column filters on table init
    // These are used later whenever a user clicks "Clear Filters" button; we can loop
    // through _hiddenColumnFilters array and set that column state back to initial load
    private saveHiddenColumnFilters() {
        let columns: Column[] = this.dt.columns;

        for (let i = 0; i < columns.length; i++) {
            if (columns[i].hideColumnFilter) {
                this._hiddenColumnFilters.push(columns[i].field);
            }
        }
    }

    // saveHiddenColumns is used to gather initial hidden columns on table init
    // These are used later whenever a user clicks "Clear Filters" button; we can loop
    // through _hiddenColumns array and set that column state back to initial load
    private saveHiddenColumns() {
        let columns: Column[] = this.dt.columns;

        for (let i = 0; i < columns.length; i++) {
            if (columns[i].hideColumn) {
                console.log('column ' + i + ' hidden');
                this._hiddenColumns.push(columns[i].field);
            } else {
                this.visibleColumns++;
            }
        }
    }

    // getGridInfo is responsible for actually querying the server
    // The update() function should be used to call this indirectly
    //
    // url: The encoded url to call against server
    // fn: Optional parameter that is a callback function 
    private getGridInfo(url: string) {
        this.http.get<any>(
            url,
            this.config.tableAPIConfig.apiOptions as any,
        ).subscribe(r => {
            let res = r as HttpResponse<FilterData>;

            if (!this._tableInit) {
                this.initCRSEvents();
            }

            if (this.config.resetEditedRowsOnTableFilter) {
                this.resetEditedRows();
            }

            this._tableInit = true;
            this._onTableFilterEvent.emit(res);
            this._updateBodyCellComponents = true;

            // If we get no results back and showNoRecordsLabel is set true,
            // inject one row and display text of no records
            //
            // This is a hack for the fact that when there are no rows
            // in table, you can't horizontally scroll the headers
            if (res.body.total == 0 && this.config.showNoRecordsLabel) {
                this.showNoRecordsLabel = true;
                this.dt.value = [this.config.showNoRecordsLabel];
                this.dt.totalRecords = 1;

                let columns: Column[] = this.dt.columns

                for (let i = 0; i < columns.length; i++) {
                    columns[i].renderColumnContent = false;
                }
            } else {
                this.showNoRecordsLabel = false;

                if (this.config.showNoRecordsLabel) {
                    let columns: Column[] = this.dt.columns;

                    for (let i = 0; i < columns.length; i++) {
                        columns[i].renderColumnContent = true;
                    }
                }

                this.dt.value = res.body.data;
                this.dt.totalRecords = res.body.total;
            }

            if (this.config.tableAPIConfig.processResult != undefined) {
                this.config.tableAPIConfig.processResult(r, this);
            }

            this.dt.loading = false;
        }, (err) => {
            this.dt.loading = false;

            if (this.config.tableAPIConfig.processError != undefined) {
                this.config.tableAPIConfig.processError(err);
            }
        });
    }

    // getFilterParams takes current object's state and encodes it to be 
    // used in url parameter and returns the encoded value
    public getFilterParams(fieldNames?: FieldName[]): string {
        //console.log(this.state);    
        let url = "?" + this.config.paramConfig.take + "=" + this.state.take + "&" + this.config.paramConfig.skip + "=" + this.state.skip;

        if (this.state.filter != undefined) {
            let filters = this.state.filter.filters as FilterDescriptor[];
            if (fieldNames != null) {
                for (let i = 0; i < filters.length; i++) {
                    for (let k = 0; k < fieldNames.length; k++) {
                        if (filters[i].field == fieldNames[k].oldName) {
                            filters[i].field = fieldNames[k].newName;
                        }
                    }
                }
            }

            url += "&" + this.config.paramConfig.filters + "=" + encodeURIComponent(JSON.stringify(filters));
        }

        if (this.state.sort != undefined) {
            if (this.state.sort.length != 0) {
                const sorts = this.state.sort;
                let sortsArray = new Array<SortDescriptor>();

                for (let i = 0; i < sorts.length; i++) {
                    if (fieldNames != null) {
                        for (let k = 0; k < fieldNames.length; k++) {
                            if (sorts[i].field == fieldNames[k].oldName) {
                                sorts[i].field = fieldNames[k].newName;
                            }
                        }
                    }

                    if (sorts[i].dir != undefined && sorts[i].dir != null) {
                        sortsArray.push(sorts[i]);
                    }
                }

                url += "&" + this.config.paramConfig.sorts + "=" + encodeURIComponent(JSON.stringify(sortsArray));
            }
        }

        return url;
    }

    // resetSortIcons resets all columns that have sort enabled back to
    // a neutral state and resets the icon
    public resetSortIcons() {
        this.sortIcons.forEach(item => {
            item.sortOrder = 'none';
        });
        this.dt.sortOrder = -1;
        this._sortMap.forEach((v, k) => {
            this._sortMap.set(k, 0)
        })
    }

    // clearFilters will clear current object's filter state
    // of filter, sort and group by and then update the table
    // by making call to server
    public clearFilters() {
        this.resetSortIcons();
        this.clearFilterState();
    }

    private clearFilterState() {
        this.state.filter = {
            logic: 'and',
            filters: []
        };
        this.state.sort = [];

        this._onClearFiltersEvent.emit(null);
        this.columnFilterCrs.forEach(item => {
            item.instance.clearFilter();
        })

        let columns: Column[] = this.dt.columns;

        for (let i = 0; i < columns.length; i++) {
            for (let k = 0; k < this._hiddenColumnFilters.length; k++) {
                if (this._hiddenColumnFilters[k] == columns[i].field) {
                    columns[i].hideColumnFilter = true;
                }
            }
            for (let k = 0; k < this._hiddenColumns.length; k++) {
                if (this._hiddenColumns[k] == columns[i].field) {
                    console.log('hide column ' + i)
                    columns[i].hideColumn = true;
                }
            }
        }

        if (this.config.autoSearch) {
            this.update();
        }
    }

    // update takes the current state and applies to them to
    // create a url and makes a request to url
    //
    // This function should be the default function called 
    // when manually calling for an update
    public update() {
        if (this.config.customTableSearch != undefined) {
            this.config.customTableSearch(this);
        } else {
            if (
                this.config.tableSettingsAPIConfig != undefined &&
                this.config.tableAPIConfig.apiURL(this.outerData) != "" &&
                this.config.tableAPIConfig.apiURL(this.outerData) != null
            ) {
                let url = this.config.tableAPIConfig.apiURL(this.outerData) + this.getFilterParams();
                //this.dt.loading = true;
                this.getGridInfo(url);
            } else {
                this.dt.loading = false;
            }
        }
    }

    // updateSettings updates a table's column filters if they are dynamic based
    public updateSettings() {
        if (
            this.config.tableSettingsAPIConfig != undefined &&
            this.config.tableSettingsAPIConfig.apiURL(this.outerData) != "" &&
            this.config.tableSettingsAPIConfig.apiURL(this.outerData) != null
        ) {
            let config = this.config.tableSettingsAPIConfig;

            this.http.get(
                config.apiURL(this.outerData),
                config.apiOptions as any,
            ).subscribe(r => {
                if (config.processResult != undefined) {
                    config.processResult(r, this)
                }
            }, (err: any) => {
                if (config.processError != undefined && config.processError != null) {
                    config.processError(err);
                }
            });
        }
    }

    // refresh simply combines querying for table data and table settings
    public refresh() {
        this.update();
        this.updateSettings();
    }

    ///////////////////////////////////////////
    // EDIT FUNCTIONALITY
    ///////////////////////////////////////////

    private unsubscribeCells() {
        this._cellSubs.forEach(x => {
            x.unsubscribe();
        })
        this._cellSubs = [];
    }

    public onEditInit(event: EditEventConfig) {
        if (this.config.onEditInit != undefined) {
            this.config.onEditInit(event, this);
        }
    }

    public onEditCancel(event: EditEventConfig) {
        if (this.config.onEditCancel != undefined) {
            this.config.onEditCancel(event, this);
        }
        this.unsubscribeCells();
    }

    public onEditComplete(event: EditEventConfig) {
        if (this.config.onEditComplete != undefined) {
            this.config.onEditComplete(event, this);
        }
        this.unsubscribeCells();
    }

    ///////////////////////////////////////////
    // SET FUNCTIONS
    ///////////////////////////////////////////

    public setTableAPIConfig(cfg: APIConfig) {
        this.config.tableAPIConfig = cfg;
    }

    public setTableSettingsAPIConfig(cfg: APIConfig) {
        this.config.tableSettingsAPIConfig = cfg;
    }

    public setScrollHeight(height: string) {
        this.config.scrollHeight = height;
    }

    public resetEditedRows() {
        this._clonedRowData = {};
        window.localStorage.removeItem(this.config.localStorageKeyForEditedRows)
    }

    public setEditedRows(obj: Object) {
        this._clonedRowData = obj;
    }

    ///////////////////////////////////////////
    // GET FUNCTIONS
    ///////////////////////////////////////////

    public getEditedRows(): Object {
        return this._clonedRowData;
    }

    public getEditedRowsFromStorage(): Object {
        return JSON.parse(window.localStorage.getItem(
            this.config.localStorageKeyForEditedRows
        ))
    }

    ///////////////////////////////////////////
    // EVENTS
    ///////////////////////////////////////////

    // expand loops through all rows in table and toggles them open 
    // if they are not already open
    private expand() {
        this._rowExpandIdx++;

        if (this._rowExpandIdx < this.dt.value.length - 1) {
            if (!this.dt.isRowExpanded(this.dt.value[this._rowExpandIdx])) {
                this.dt.toggleRow(this.dt.value[this._rowExpandIdx]);
                this._rowExpandIdx++;
            }
        } else {
            this._rowExpandIdx = 0;
        }
    }

    // sortField is function used in template to simply take in column
    // and if sort is set for that column, return the json field name
    public sortField(col: Column): string {
        if (col.sort != undefined) {
            return col.sort.sortField;
        }

        return '';
    }

    // isSortDisabled is function used in template to take in column
    // and determine if sort is disabled or not
    public isSortDisabled(col: Column): boolean {
        if (col.sort != undefined) {
            return col.sort.disableSort;
        }

        return false;
    }

    // closeExpandedRows will close all row expansion for current table
    public closeExpandedRows() {
        for (let i = 0; i < this.dt.value.length; i++) {
            if (this.dt.isRowExpanded(this.dt.value[i])) {
                this.dt.toggleRow(this.dt.value[i]);
            }
        }
    }

    // expandRows listens for the callback from the inner table
    // that indicates it is fully render and then calls expand
    // on the next table until all rows are expanded
    public expandRows() {
        let sub = this.renderCallback.subscribe(r => {
            this.expand()
        })
        sub.unsubscribe();
    }

    // onSortChange is a hack function to workaround the default way
    // primeng does sorting on the table
    public onSortChange(event: any) {
        this.state.sort = [];
        // console.log('sort event');
        // console.log(event);

        let clicks: number = 0;
        let tempMap: Map<string, number> = new Map<string, number>();

        // Loop through global sortmap and if current event field is found,
        // increase the number of clicks
        // Else set the rest of the fields in the map back to 0
        this._sortMap.forEach((v, k) => {
            if (k == event.field) {
                clicks = v
                clicks++;
                tempMap.set(k, clicks);
            } else {
                tempMap.set(k, 0)
            }
        })

        this._sortMap = tempMap;

        // console.log('sort map')
        // console.log(this._sortMap);

        let sortDescriptor: SortDescriptor = {
            field: event.field
        }

        // If current field has been clicked three times,
        // we set it back to a netrual sort state
        // Else progress through the different sort states
        if (clicks == 3) {
            this.sortColumns.forEach(item => {
                if (item.field == sortDescriptor.field) {
                    this.dt.sortOrder = -1;
                }
            })
        } else {
            if (event.order == 1) {
                sortDescriptor.dir = 'asc';
            } else {
                sortDescriptor.dir = 'desc';
            }
        }

        // Loop through the sort icons and reset them all
        // to neutral state except for current sort field 
        this.sortIcons.forEach(item => {
            if (item.sortField == sortDescriptor.field) {
                if (clicks == 1) {
                    item.sortOrder = 'asc';
                    this.state.sort.push(sortDescriptor);
                } else if (clicks == 2) {
                    item.sortOrder = 'desc';
                    this.state.sort.push(sortDescriptor);
                } else {
                    item.sortOrder = 'none';
                    this._sortMap.set(sortDescriptor.field, 0)
                }
            } else {
                item.sortOrder = 'none';
            }
        })

        this._onSortEvent.emit(event.field);

        if (this.config.autoSearch) {
            this.update();
        }
    }

    // addHiddenColumn decreases our "visibleColumns" variable which is used for
    // row expansion
    // 
    // This function should be used instead of trying to override "visibleColumns" manually
    public addHiddenColumn(field: string) {
        let columns: Column[] = this.dt.columns;

        for (let i = 0; i < columns.length; i++) {
            if (columns[i].field == field) {
                this.visibleColumns--;
                columns[i].hideColumn = true;
            }
        }

        console.log('add visible columns: ' + this.visibleColumns);
    }

    // removeHiddenColumn increases our "visibleColumns" variable which is used for
    // row expansion
    // 
    // This function should be used instead of trying to override "visibleColumns" manually
    public removeHiddenColumn(field: string) {
        let columns: Column[] = this.dt.columns;

        for (let k = 0; k < columns.length; k++) {
            if (columns[k].field == field) {
                columns[k].hideColumn = false;
                this.visibleColumns++;
            }
        }

        console.log('remove visible columns: ' + this.visibleColumns);
    }

    // onPageChange is callback function used whenever our table
    // changes page size or index
    //
    // event.first = Index of the first record
    // event.rows = Number of rows to display in new page
    public onPageChange(event: any) {
        this.state.skip = event.first;
        this.state.take = event.rows;
        this.update();
    }

    public onRowExpand(event: any) {
        console.log("row expand: visible cols " + this.visibleColumns);
        //console.log(this.visibleColumns);
        //this.initExpansionComponents(event.data);
    }

    // onRowCollapse allows user to collapse all currently open rows
    public onRowCollapse(event: any) {
        for (let i = 0; i < this.rowExpansionCrs.length; i++) {
            if (this.rowExpansionCrs[i].instance.outerData.id == event.data.id) {
                console.log('destroying row expanded');
                this.rowExpansionCrs[i].destroy();
                this.rowExpansionCrs.splice(i, 1);
            }
        }
    }

    // onColumnHeaderChange is responsible for hiding/showing columns 
    // based on event passed
    public onColumnHeaderChange(event: any) {
        let columns: Column[] = this.dt.columns;

        if (event.itemValue != undefined) {
            let values: any[] = event.value;
            let isSelected = false;

            values.forEach(item => {
                if (item == event.itemValue) {
                    isSelected = true;
                }
            });

            columns.forEach(item => {
                if (item.field == event.itemValue) {
                    if (isSelected) {
                        this.removeHiddenColumn(item.field);
                    } else {
                        this.addHiddenColumn(item.field);
                    }
                }
            });
        } else {
            columns.forEach(item => {
                if (item.showColumnOption) {
                    if (event.value.length != 0) {
                        if (item.hideColumn) {
                            this.removeHiddenColumn(item.field);
                        }
                    } else {
                        if (!item.hideColumn) {
                            this.addHiddenColumn(item.field);
                        }
                    }
                }
            });
        }
    }

    public columnHeaderChange(values: any[]) {
        let columns: Column[] = this.dt.columns;

        columns.forEach(x => {
            if (x.showColumnOption) {
                let found = false;

                values.forEach(t => {
                    if (x.field == t) {
                        found = true
                    }
                })

                if (found) {
                    this.removeHiddenColumn(x.field)
                } else {
                    this.addHiddenColumn(x.field);
                }
            }
        })
    }

    // toast adds ability to have a toast message based on message passed
    public toast(msg: Message) {
        this.messageService.add(msg);
    }

    ///////////////////////////////////////////
    // INIT COMPONENT
    ///////////////////////////////////////////

    public ngOnInit(): void {
        console.log('hitting base table!!!')
        this.init();
    }

    public ngAfterViewInit() {
        this.initAfterView();
    }

    ///////////////////////////////////////////
    // EXPORT FUNCTIONS
    ///////////////////////////////////////////

    // exportButton is function that allows user to export current filtered data to 
    // desired type base on ExportType passed
    public exportButton(typ: ExportType) {
        let url: string;
        let fileName: string;
        let fileType: string;
        let blobOpts = {
            type: ""
        }

        // Determine which type we want to export to
        // We should then get a url specific for that file type request to
        // send to server
        switch (typ) {
            case ExportType.csv:
                url = this.config.exportConfig.exportFormats.csv.exportAPI(this.outerData);
                fileName = this.config.exportConfig.exportFormats.csv.fileName;
                blobOpts.type = 'text/csv';
                fileType = '.csv';
                break;
            case ExportType.xls:
                url = this.config.exportConfig.exportFormats.xls.exportAPI(this.outerData);
                fileName = this.config.exportConfig.exportFormats.xls.fileName;
                fileType = '.xls';
                break;
            case ExportType.xlsx:
                url = this.config.exportConfig.exportFormats.xlsx.exportAPI(this.outerData);
                fileName = this.config.exportConfig.exportFormats.xlsx.fileName;
                fileType = '.xlsx';
                break;
        }

        url += this.getFilterParams() + "&" + this.config.exportConfig.fieldsParam + "=" +
            encodeURI(JSON.stringify(this.selectedColumns));

        // Make request with proper url for particular file type
        this.http.get(
            url,
            { withCredentials: true, observe: 'response', responseType: 'blob' }
        ).subscribe(r => {
            let newBlob = new Blob([r.body], blobOpts);

            // For other browsers: 
            // Create a link pointing to the ObjectURL containing the blob.
            const data = window.URL.createObjectURL(newBlob);
            var link = document.createElement('a');
            link.href = data;
            link.download = fileName + fileType;
            link.click();
            setTimeout(function () {
                // For Firefox it is necessary to delay revoking the ObjectURL
                window.URL.revokeObjectURL(data);
            }, 100);
        }, (err: HttpErrorResponse) => {
            alert(JSON.stringify(err));
        })
    }

    ///////////////////////////////////////////
    // HOOK FUNCTIONS
    ///////////////////////////////////////////

    public ngOnDestroy() {
        console.log('base table destroy called');
        console.log('Table Name');

        if (this.outerData != undefined) {
            console.log(this.outerData.name);
        } else {
            console.log('project name');
        }

        if (this._createSub != undefined) {
            this._createSub.unsubscribe();
        }

        this._subs.forEach(item => {
            item.unsubscribe();
        })
        this._bodyCellSubs.forEach(item => {
            item.unsubscribe();
        })

        this._createSub = null;
        this._subs = null;
        this._subs = null;
        this._bodyCellSubs = null;

        if (this.captionCr != undefined) {
            this.captionCr.destroy();
        }

        for (let i = 0; i < this.columnFilterCrs.length; i++) {
            this.columnFilterCrs[i].destroy();
        }
        for (let i = 0; i < this.bodyCellCrs.length; i++) {
            this.bodyCellCrs[i].destroy();
        }
        for (let i = 0; i < this.rowExpansionCrs.length; i++) {
            this.rowExpansionCrs[i].destroy();
        }

        this.captionCr = null;
        this.columnFilterCrs = null;
        this.bodyCellCrs = null;
        this.rowExpansionCrs = null;
        this._hiddenColumnFilters = null;
        this._hiddenColumns = null;

        let columns: Column[] = this.dt.columns

        for (let i = 0; i < columns.length; i++) {
            columns[i].hideColumn = false;
        }
    }
}