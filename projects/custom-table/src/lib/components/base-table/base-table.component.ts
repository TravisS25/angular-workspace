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
    OnChanges, SimpleChanges, ɵɵCopyDefinitionFeature, Type, ElementRef
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
    APIConfig,
    ParamConfig,
    BaseColumnItems,
    ColumnEntity,
    BaseColumnItemsI,
    EditEvent,
    BaseCaptionItemsI,
    BaseCaptionItems,
    RowExpansionItems,
    BaseTableItems,
} from '../../table-api';
import { DialogService } from 'primeng/dynamicdialog';
import { DynamicBodyCellDirective } from '../../directives/dynamic-body-cell.directive';
import { DynamicExpansionDirective } from '../../directives/dynamic-expansion.directive';
import { Checkbox } from 'primeng/checkbox';
import { DynamicCaptionDirective } from '../../directives/dynamic-caption.directive';
import { Subscription, Subscribable, Subject } from 'rxjs';
import { DynamicColumnFilterDirective } from '../../directives/dynamic-column-filter.directive';
import { DynamicTableCellDirective } from '../../directives/dynamic-table-cell.directive';
import { deepCopyColumn } from '../../copy-util';
import { ColumnCheckboxDirective } from '../../directives/column-checkbox.directive';
import { SortIconComponent } from '../filter-components/sort-icon/sort-icon.component';
import { ComponentFactory } from '@angular/core';
import { DynamicOutputTemplateDirective } from '../../directives/dynamic-output-template.directive';
import { DynamicInputTemplateDirective } from '../../directives/dynamic-input-template.directive';
import { DynamicSummaryDirective } from '../../directives/dynamic-summary.directive';
import { DynamicBaseCellDirective } from '../../directives/dynamic-base-cell.directive';
import { isNgTemplate } from '@angular/compiler/src/ml_parser/tags';
import { getJSONFieldValue } from '../../util';

interface outputTemplateConfig {
    updateOutputTemplate: boolean;
    rowIdx: number;
    field: string;
}

@Component({
    selector: 'app-base-table',
    templateUrl: './base-table.component.html',
    styleUrls: ['./base-table.component.scss'],
})
export class BaseTableComponent implements OnInit, AfterViewInit, OnDestroy {
    private _outputTemplateCfg: outputTemplateConfig = {
        updateOutputTemplate: false,
        rowIdx: -1,
        field: '',
    }

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

    // _updateBodyCellComponents is used as a "hack flag" for body cell directives as
    // change events occur with any little change so this is set on initial load
    // and any events after that will not be effected
    private _updateBodyCellComponents: boolean = false;

    private _updateTableCellDirs: boolean = false;

    // _updateOutputTemplateComponents is used as a "hack flag" for output template directives as
    // change events occur with any little change so this is set on initial load
    // and any events after that will not be effected
    private _updateOutputTemplateComponents: boolean = false;

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

    // _inputTemplateSubs is used to keep track of subscriptions of input templates for cell editing
    private _inputTemplateSubs: Subscription[] = [];

    // _editedRowData is used to keep track of edited rows by user
    // The key value used is the one set in BaseTableConfig#dataKey
    private _editedRowData: { [s: string]: any; } = {};

    // _clonedData is used to keep track of original rows so
    // if user decides to cancel, we can set them back to original value 
    private _clonedData: any[];

    // _currentEditedRow represents the row that is currently being edited
    private _currentEditedRow: any;

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
    public columnFilterCrs: ComponentRef<BaseColumnItems>[] = [];

    // rowExpansionCrs keeps a list of references to dynamically created expanded row
    // components which can be modified through different events and will be destroyed on 
    // component destruction
    public rowExpansionCrs: ComponentRef<RowExpansionItems>[] = [];

    // bodyCellCrs keeps a list of references to dynamically created body cell 
    // which can be modified through different events and will be destroyed on 
    // component destruction
    public bodyCellCrs: ComponentRef<BaseColumnItems>[] = [];

    // outputTemplateCrMap keeps a list of references to dynamically created output template
    // which can be modified through different events and will be destroyed on 
    // component destruction
    public outputTemplateCrMap: Map<number, Map<string, ComponentRef<BaseColumnItems>>> = new Map();

    // captionCr keeps a reference to dynamically created caption component which can be 
    // modified through different events and will be destroyed on component destruction
    public captionCr: ComponentRef<BaseCaptionItems>;

    // summaryCr keeps a reference to dynamically created summary component which can be 
    // modified through different events and will be destroyed on component destruction
    public summaryCr: ComponentRef<BaseTableItems>;

    public tableCellDirMap: Map<number, Map<string, DynamicTableCellDirective>> = new Map();

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
    @ViewChild(DynamicSummaryDirective, { static: false })
    public summaryDir: DynamicCaptionDirective;

    @ViewChildren(DynamicExpansionDirective)
    public expansionDirs: QueryList<DynamicExpansionDirective>;
    @ViewChildren(DynamicBodyCellDirective)
    public bodyCellDirs: QueryList<DynamicBodyCellDirective>;
    @ViewChildren(DynamicInputTemplateDirective)
    public inputTemplateDirs: QueryList<DynamicInputTemplateDirective>;
    @ViewChildren(DynamicOutputTemplateDirective)
    public outputTemplateDirs: QueryList<DynamicOutputTemplateDirective>;
    @ViewChildren(DynamicColumnFilterDirective)
    public columnFilterDirs: QueryList<DynamicColumnFilterDirective>;
    @ViewChildren(DynamicTableCellDirective)
    public tableCellDirs: QueryList<DynamicTableCellDirective>;

    @ViewChildren(ColumnCheckboxDirective) public columnCheckboxes: QueryList<ColumnCheckboxDirective>;
    @ViewChildren(SortIconComponent) public sortIcons: QueryList<SortIconComponent>;
    @ViewChildren(SortableColumn) public sortColumns: QueryList<SortableColumn>;

    // defaultProperty is the default property used to be set for primeng's table "dataKey" property
    public defaultProperty: string = 'id';
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
                        cr.instance.isColumnFilter = true;
                        cr.instance.isInputTemplate = false;

                        if (columns[item.colIdx].columnFilter != undefined) {
                            cr.instance.field = columns[item.colIdx].columnFilter.field;
                            cr.instance.value = columns[item.colIdx].columnFilter.value;
                            cr.instance.selectedValue = columns[item.colIdx].columnFilter.selectedValue;
                            cr.instance.config = columns[item.colIdx].columnFilter.config;
                            cr.instance.excludeFilter = columns[item.colIdx].columnFilter.excludeFilter;

                            if (columns[item.colIdx].columnFilter.operator != undefined) {
                                cr.instance.operator = columns[item.colIdx].columnFilter.operator;
                            }
                        }

                        cr.instance.onEvent = new EventEmitter<any>();
                        this.columnFilterCrs.push(cr);
                    });
                }

                this._updateColumnFilter = false;
            })
        )
    }

    // createCellComponentRef creates and return a component reference based on the directive
    // and ComponentRef passed
    private createCellComponentRef(dir: DynamicBaseCellDirective, ce: ColumnEntity): ComponentRef<BaseColumnItems> {
        const cf = this.cfr.resolveComponentFactory(ce.component);
        const cr = dir.viewContainerRef.createComponent(cf);
        cr.instance.baseTable = this;
        cr.instance.colIdx = dir.colIdx;
        cr.instance.rowIdx = dir.rowIdx;
        cr.instance.rowData = dir.rowData;
        cr.instance.isColumnFilter = false;
        cr.instance.isInputTemplate = false;
        cr.instance.config = ce.config;
        cr.instance.field = ce.field;
        cr.instance.value = ce.value;
        cr.instance.operator = ce.operator;
        cr.instance.selectedValue = ce.selectedValue;
        cr.instance.getSelectedValue = ce.getSelectedValue;
        cr.instance.processRowData = ce.processRowData;
        cr.instance.onEvent = new EventEmitter<any>();
        return cr;
    }

    // initCellComponents initializes cell component references and creates component
    private initCellComponents() {
        let columns: Column[] = this.dt.columns;

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
                        let ce = columns[item.colIdx].bodyCell
                        this.bodyCellCrs.push(this.createCellComponentRef(item, ce));
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
            this.outputTemplateDirs.changes.subscribe(val => {
                console.log('output template dir change');
                console.log(val)

                let results = val._results as DynamicOutputTemplateDirective[];

                if (this._updateOutputTemplateComponents || this._outputTemplateCfg.updateOutputTemplate) {
                    if (this._tableInit && this._updateOutputTemplateComponents) {
                        this.outputTemplateCrMap.forEach(items => {
                            items.forEach(item => {
                                item.destroy();
                            })
                        })
                        this.outputTemplateCrMap.clear();
                    }

                    results.forEach(item => {
                        let ce = columns[item.colIdx].templateConfig.outputTemplate;

                        if (this._updateOutputTemplateComponents) {
                            const cr = this.createCellComponentRef(item, ce);
                            let rowCrMap: Map<string, ComponentRef<BaseColumnItems>>;

                            if (this.outputTemplateCrMap.has(item.rowIdx)) {
                                rowCrMap = this.outputTemplateCrMap.get(item.rowIdx);
                            } else {
                                rowCrMap = new Map();
                            }

                            rowCrMap.set(item.field, cr);
                            this.outputTemplateCrMap.set(item.rowIdx, rowCrMap);
                        } else if (this.config.editMode == 'cell') {
                            console.log('re creating some stuff')

                            if (
                                item.field == this._outputTemplateCfg.field &&
                                item.rowIdx == this._outputTemplateCfg.rowIdx
                            ) {
                                this.createCellComponentRef(item, ce);
                            }
                        }
                    });

                    // console.log('output template dir after init')
                    // console.log(this._outputTemplateDirMap);
                }

                this.cdr.detectChanges();
                this._updateOutputTemplateComponents = false;
                this._outputTemplateCfg.updateOutputTemplate = false;
                this._outputTemplateCfg.rowIdx = -1;
                this._outputTemplateCfg.field = '';
            }),
            this.inputTemplateDirs.changes.subscribe(val => {
                console.log('input template dir change');
                console.log(val);

                let results = val._results as DynamicInputTemplateDirective[];

                results.forEach(item => {
                    // Check edit mode as logic might have to be slightly different between cell and row edit
                    if (this.config.editMode == 'cell') {
                        const cr = this.createCellComponentRef(item, columns[item.colIdx].templateConfig.inputTemplate);

                        // Manually setting the selectedValue as when we go from output template to input template,
                        // we want the input template component to have same value as what is being displayed to user
                        // in output template
                        cr.instance.selectedValue = getJSONFieldValue(item.field, this._currentEditedRow)

                        // As each input template is being dynamically created, we want to subscribe to each of
                        // its events as this will give ability to reflect change to output template display
                        this._inputTemplateSubs.push(
                            cr.instance.onEvent.subscribe(r => {
                                let result: BaseTableEvent = r;
                                let cfg = result.event as EditEvent;

                                if (this._currentEditedRow[cfg.field] != cfg.data[cfg.field]) {
                                    this._editedRowData[cfg.data[this.config.dataKey]] = cfg.data;
                                    this.dt.value[item.rowIdx] = cfg.data;
                                }

                                if (this.config.localStorageKeyForEditedRows != undefined) {
                                    window.localStorage.setItem(
                                        this.config.localStorageKeyForEditedRows,
                                        JSON.stringify(this._editedRowData)
                                    )
                                }

                                columns.forEach(x => {
                                    if (x.field == item.field && x.processInputTemplateEvent != undefined) {
                                        x.processInputTemplateEvent(r, this);
                                    }
                                })

                                this.columnFilterCrs.forEach(x => {
                                    if (x.instance.field == item.field && x.instance.processInputTemplateEvent != undefined) {
                                        x.instance.processInputTemplateEvent(r, this);
                                    }
                                })

                                if (this.captionCr != undefined && this.captionCr.instance.processInputTemplateEvent != undefined) {
                                    this.captionCr.instance.processInputTemplateEvent(r, this);
                                }
                            })
                        )
                    }
                });

                this.cdr.detectChanges();
            }),
            this.tableCellDirs.changes.subscribe(val => {
                if (this._updateTableCellDirs) {
                    this.tableCellDirMap.clear();
                    let results = val._results as DynamicTableCellDirective[];

                    results.forEach(item => {
                        item.style = {};

                        let rowTableCellDir: Map<string, DynamicTableCellDirective>

                        if (this.tableCellDirMap.has(item.rowIdx)) {
                            rowTableCellDir = this.tableCellDirMap.get(item.rowIdx);
                        } else {
                            rowTableCellDir = new Map();
                        }

                        rowTableCellDir.set(item.field, item);
                        this.tableCellDirMap.set(item.rowIdx, rowTableCellDir)
                    });
                }
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
            cr.instance.onEvent = new EventEmitter<any>();
            this.captionCr = cr;
        }
    }

    // initSummaryComponent initializes and creates summary component if set by config
    private initSummaryComponent() {
        if (this.config.summary != undefined) {
            const cf = this.cfr.resolveComponentFactory(
                this.config.summary.component,
            );

            const cr = this.summaryDir.viewContainerRef.createComponent(cf);
            cr.instance.config = this.config.summary.config;
            cr.instance.baseTable = this;
            cr.instance.onEvent = new EventEmitter<any>();
            this.summaryCr = cr;
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
                    if (this.columnFilterCrs[i].instance.processTableFilterEvent != undefined) {
                        this.columnFilterCrs[i].instance.processTableFilterEvent(r, this);
                    }
                }
                for (let i = 0; i < this.bodyCellCrs.length; i++) {
                    if (this.bodyCellCrs[i].instance.processTableFilterEvent != undefined) {
                        this.bodyCellCrs[i].instance.processTableFilterEvent(r, this);
                    }
                }

                if (this.captionCr != undefined && this.captionCr.instance.processTableFilterEvent) {
                    this.captionCr.instance.processTableFilterEvent(r, this);
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
                    if (this.columnFilterCrs[i].instance.processClearFiltersEvent != undefined) {
                        this.columnFilterCrs[i].instance.processClearFiltersEvent(r, this);
                    }
                }
                for (let i = 0; i < this.bodyCellCrs.length; i++) {
                    if (this.bodyCellCrs[i].instance.processClearFiltersEvent != undefined) {
                        this.bodyCellCrs[i].instance.processClearFiltersEvent(r, this);
                    }
                }

                if (this.captionCr != undefined && this.captionCr.instance.processClearFiltersEvent) {
                    this.captionCr.instance.processClearFiltersEvent(r, this);
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
                    if (columns[i].processSortEvent != undefined) {
                        columns[i].processSortEvent(r, this);
                    }
                }

                for (let i = 0; i < this.columnFilterCrs.length; i++) {
                    if (this.columnFilterCrs[i].instance.processSortEvent != undefined) {
                        this.columnFilterCrs[i].instance.processSortEvent(r, this);
                    }
                }
                for (let i = 0; i < this.bodyCellCrs.length; i++) {
                    if (this.bodyCellCrs[i].instance.processSortEvent != undefined) {
                        this.bodyCellCrs[i].instance.processSortEvent(r, this);
                    }
                }

                if (this.captionCr != undefined && this.captionCr.instance.processSortEvent != undefined) {
                    this.captionCr.instance.processSortEvent(r, this);
                }

                if (this.config.processSortEvent != undefined) {
                    this.config.processSortEvent(r, this);
                }
            })
        )

        // subscribing all components to caption event which occurs whenever
        // user emits some activity within caption.  onCaptionEvent is mainly 
        // triggered by custom emits
        if (this.captionCr != undefined) {
            this._subs.push(
                this.captionCr.instance.onEvent.subscribe(r => {
                    for (let i = 0; i < columns.length; i++) {
                        if (columns[i].processCaptionEvent != undefined) {
                            columns[i].processCaptionEvent(r, this);
                        }
                    }
                    for (let i = 0; i < this.columnFilterCrs.length; i++) {
                        if (this.columnFilterCrs[i].instance.processCaptionEvent != undefined) {
                            this.columnFilterCrs[i].instance.processCaptionEvent(r, this);
                        }
                    }
                    for (let i = 0; i < this.bodyCellCrs.length; i++) {
                        if (this.bodyCellCrs[i].instance.processCaptionEvent != undefined) {
                            this.bodyCellCrs[i].instance.processCaptionEvent(r, this);
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
                this.columnFilterCrs[i].instance.onEvent.subscribe(r => {
                    for (let t = 0; t < columns.length; t++) {
                        if (
                            columns[t].processColumnFilterEvent != undefined &&
                            columns[t].columnFilter != undefined &&
                            columns[t].columnFilter.field == this.columnFilterCrs[i].instance.field
                        ) {
                            columns[t].processColumnFilterEvent(r, this);
                        }
                    }

                    for (let t = 0; t < this.bodyCellCrs.length; t++) {
                        if (this.bodyCellCrs[t].instance.colIdx == this.columnFilterCrs[i].instance.colIdx) {
                            if (this.bodyCellCrs[t].instance.processColumnFilterEvent != undefined) {
                                this.bodyCellCrs[t].instance.processColumnFilterEvent(r, this);
                            }
                        }
                    }

                    if (this.captionCr != undefined && this.captionCr.instance.processColumnFilterEvent) {
                        this.captionCr.instance.processColumnFilterEvent(r, this);
                    }

                    if (this.config.processColumnFilterEvent != undefined) {
                        this.config.processColumnFilterEvent(r, this);
                    }

                    if (!this.columnFilterCrs[i].instance.excludeFilter) {
                        let cfg = r as BaseTableEvent;
                        let event = cfg.event as FilterDescriptor;

                        // console.log('event filter')
                        // console.log(event)

                        if (event.field !== '' && event.field !== undefined && event.field !== null) {
                            let filterIdx = -1;
                            let filters = this.state.filter.filters as FilterDescriptor[];

                            // console.log('filter before stuff')
                            // console.log(filters)

                            for (let i = 0; i < filters.length; i++) {
                                if (filters[i].field == event.field) {
                                    filterIdx = i;
                                }
                            }

                            if (filterIdx > -1) {
                                this.state.filter.filters.splice(filterIdx, 1);
                            }

                            // console.log('filter after splice')
                            // console.log(filters)

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

                            // console.log('filter at the end')
                            // console.log(filters)

                            if (this.config.autoSearch) {
                                this.update();
                            }
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
                this.bodyCellCrs[i].instance.onEvent.subscribe(r => {
                    for (let t = 0; t < this.columnFilterCrs.length; t++) {
                        if (this.columnFilterCrs[t].instance.colIdx == this.bodyCellCrs[i].instance.colIdx) {
                            if (this.columnFilterCrs[t].instance.processBodyCellEvent != undefined) {
                                this.columnFilterCrs[t].instance.processBodyCellEvent(r, this);
                            }
                        }
                    }

                    let columns: Column[] = this.dt.columns;

                    for (let t = 0; t < columns.length; t++) {
                        if (
                            columns[t].processBodyCellEvent != undefined &&
                            columns[t].bodyCell != undefined &&
                            columns[t].bodyCell.field == this.bodyCellCrs[i].instance.field
                        ) {
                            columns[t].processBodyCellEvent(r, this);
                        }
                    }

                    if (this.captionCr != undefined && this.captionCr.instance.processBodyCellEvent) {
                        this.captionCr.instance.processBodyCellEvent(r, this);
                    }
                    if (this.config.processBodyCellEvent != undefined) {
                        this.config.processBodyCellEvent(r, this);
                    }
                })
            );
        }
    }

    private initDynamicComponents() {
        this.initSummaryComponent();
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
    private getGridInfo(url: string) {
        this.http.get<any>(
            url,
            this.config.tableAPIConfig.apiOptions as any,
        ).subscribe(r => {
            let res = r as HttpResponse<FilterData>;

            // If table is not yet initialized, initiate all of our cr event to 
            // listen to each other
            if (!this._tableInit) {
                this.initCRSEvents();
            }

            // Reset edited columns if set
            if (this.config.resetEditedRowsOnTableFilter) {
                this.resetEditedRows();
            }

            this._tableInit = true;
            this._onTableFilterEvent.emit(res);
            this._updateBodyCellComponents = true;
            this._updateOutputTemplateComponents = true;
            this._updateTableCellDirs = true;

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
                this._clonedData = res.body.data;
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
        if (this.config.getState != undefined) {
            this.state = this.config.getState(this.outerData);
        } else {
            this.state.filter = {
                logic: 'and',
                filters: []
            };
            this.state.sort = [];
        }

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
                this.config.tableAPIConfig != undefined &&
                this.config.tableAPIConfig.apiURL(this.outerData) != "" &&
                this.config.tableAPIConfig.apiURL(this.outerData) != null
            ) {
                this.getGridInfo(this.config.tableAPIConfig.apiURL(this.outerData) + this.getFilterParams());
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

    private unsubscribeTemplateCells() {
        this._inputTemplateSubs.forEach(x => {
            x.unsubscribe();
        })
        this._inputTemplateSubs = [];
    }

    public onEditInit(event: EditEvent) {
        console.log('edit init row data');
        console.log(event.data);
        this._currentEditedRow = event.data;

        if (this.config.onEditInit != undefined) {
            this.config.onEditInit(event, this);
        }
    }

    public onEditCancel(event: EditEvent) {
        this.unsubscribeTemplateCells();

        if (this.config.onEditCancel != undefined) {
            this.config.onEditCancel(event, this);
        }
    }

    public onEditComplete(event: EditEvent) {
        console.log('edit complete row data');
        console.log(event.data);

        this.unsubscribeTemplateCells();
        this._outputTemplateCfg.updateOutputTemplate = true;
        this._outputTemplateCfg.rowIdx = event.index;
        this._outputTemplateCfg.field = event.field;

        if (this.config.onEditComplete != undefined) {
            this.config.onEditComplete(event, this);
        }
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
        this._editedRowData = {};
        window.localStorage.removeItem(this.config.localStorageKeyForEditedRows)
    }

    public setEditedRows(obj: Object) {
        this._editedRowData = obj;
    }

    ///////////////////////////////////////////
    // GET FUNCTIONS
    ///////////////////////////////////////////

    public getEditedRows(): Object {
        return this._editedRowData;
    }

    public getCurrentEditedRow(): any {
        return this._currentEditedRow;
    }

    public getClonedData(): any[] {
        return this._clonedData;
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
        console.log("row expand: visible columns " + this.visibleColumns);
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

    // // onColumnHeaderChange is responsible for hiding/showing columns 
    // // based on event passed
    // public onColumnHeaderChange(event: any) {
    //     let columns: Column[] = this.dt.columns;

    //     if (event.itemValue != undefined) {
    //         let values: any[] = event.value;
    //         let isSelected = false;

    //         values.forEach(item => {
    //             if (item == event.itemValue) {
    //                 isSelected = true;
    //             }
    //         });

    //         columns.forEach(item => {
    //             if (item.field == event.itemValue) {
    //                 if (isSelected) {
    //                     this.removeHiddenColumn(item.field);
    //                 } else {
    //                     this.addHiddenColumn(item.field);
    //                 }
    //             }
    //         });
    //     } else {
    //         columns.forEach(item => {
    //             if (item.showColumnOption) {
    //                 if (event.value.length != 0) {
    //                     if (item.hideColumn) {
    //                         this.removeHiddenColumn(item.field);
    //                     }
    //                 } else {
    //                     if (!item.hideColumn) {
    //                         this.addHiddenColumn(item.field);
    //                     }
    //                 }
    //             }
    //         });
    //     }
    // }

    // public columnHeaderChange(values: any[]) {
    //     let columns: Column[] = this.dt.columns;

    //     columns.forEach(x => {
    //         if (x.showColumnOption) {
    //             let found = false;

    //             values.forEach(t => {
    //                 if (x.field == t) {
    //                     found = true
    //                 }
    //             })

    //             if (found) {
    //                 this.removeHiddenColumn(x.field)
    //             } else {
    //                 this.addHiddenColumn(x.field);
    //             }
    //         }
    //     })
    // }

    // toast adds ability to have a toast message based on message passed
    public toast(msg: Message) {
        this.messageService.add(msg);
    }

    ///////////////////////////////////////////
    // INIT COMPONENT
    ///////////////////////////////////////////

    public ngOnInit(): void {
        this.init();
    }

    public ngAfterViewInit() {
        this.initAfterView();
    }

    ///////////////////////////////////////////
    // EXPORT FUNCTIONS
    ///////////////////////////////////////////

    public exportData(typ: ExportType, url: string, fileName: string) {
        let fileType: string;
        let blobOpts = {
            type: ""
        }

        // Determine which type we want to export to
        // We should then get a url specific for that file type request to
        // send to server
        switch (typ) {
            case ExportType.csv:
                blobOpts.type = 'text/csv';
                fileType = '.csv';
                break;
            case ExportType.xls:
                fileType = '.xls';
                break;
            case ExportType.xlsx:
                fileType = '.xlsx';
                break;
        }

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