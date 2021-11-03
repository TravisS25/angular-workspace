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
    ExportType,
    BaseRowExpansionI,
    BaseTableEvent,
    APIConfig,
    ParamConfig,
    ColumnEntity,
    BaseColumnI,
    EditEvent,
    PrimengColumn,
    CoreColumn,
    BasePagination
} from '../../../table-api';
import _ from "lodash" // Import the entire lodash library
import { Subscription, Subscribable, Subject } from 'rxjs';
import { deepCopyColumn } from '../../../copy-util';
import { encodeURIState, getJSONFieldValue } from '../../../util';
import { ThrowStmt } from '@angular/compiler';
import { DefaultTableEvents } from '../../../config';
import { getDefaultParamConfig, getDefaultState } from '../../../default-values';
import { BaseTableComponent } from '../../table/base-table/base-table.component';
import { BaseColumnComponent } from '../../table/base-column/base-column.component';
import { BaseRowExpansionComponent } from '../../table/base-row-expansion/base-row-expansion.component';
import { BaseTableCaptionComponent } from '../../table/base-table-caption/base-table-caption.component';
import { TableExpansionDirective } from '../../../directives/table/table-expansion.directive';
import { TableBodyCellDirective } from '../../../directives/table/table-body-cell.directive';
import { TableInputTemplateDirective } from '../../../directives/table/table-input-template.directive';
import { TableOutputTemplateDirective } from '../../../directives/table/table-output-template.directive';
import { TableColumnFilterDirective } from '../../../directives/table/table-column-filter.directive';
import { TableCellDirective } from '../../../directives/table/table-cell.directive';
import { TableCaptionDirective } from '../../../directives/table/table-caption.directive';
import { BaseTableCellDirective } from '../../../directives/table/base-table-cell.directive';
import { PrimengSortIconComponent } from '../primeng-sort-icon/primeng-sort-icon.component';
import { deepCopyPrimengColumn } from '../../../copy-util';
import { HttpService } from '../../../services/http.service';
import { PrimengPagination } from 'projects/custom-table/src/public-api';

export interface PrimengTableConfig extends BaseTableConfig {
    // showNoRecordsLabel determines if we show a "No Records" label whenever
    // no results come back for a table
    // This is mainly used as a work around for the fact that when no results
    // come back, you can't scroll the table headers so if a table has a lot
    // of columns and goes beyond current view, you can't scoll over to 
    // change/update filters
    // This setting essentially will insert a single empty row so you are able
    // to scroll to all filters
    // 
    // Default: true
    showNoRecordsLabel?: boolean;

    // hasColGroup determines if we have column group enabled
    //
    // Default: true
    hasColGroup?: boolean;

    // Height of the scroll viewport in fixed pixels or the "flex" keyword for a dynamic size.
    // 
    // Default: '550px'
    scrollHeight?: string;

    // A property to uniquely identify a record in data
    //
    // Default: 'id'
    dataKey?: string;

    // When specifies, enables horizontal and/or vertical scrolling
    //
    // Default: true
    scrollable?: boolean;

    // Determines if columns are resizable by user
    //
    // Default: false
    resizableColumns?: boolean;

    // editMode determines whether we are editing by cell or entire row
    //
    // Default: undefined
    editMode?: 'row' | 'cell';

    // Template of the current page report element. 
    // Available placeholders are {currentPage},{totalPages},{rows},{first},{last} and {totalRecords} 
    // Default: 'Showing {first} to {last} of {totalRecords} entries'
    currentPageReportTemplate?: string;

    // Whether to display current page report
    //
    // Default: true
    showCurrentPageReport?: boolean;

    // resetEditedRowsOnTableFilter determines whether to reset edited rows
    // whenever a table filter action occurs
    // 
    // If this is set true, then the results stored in local storage, if any,
    // will also be reset
    //
    // Default: true
    resetEditedRowsOnTableFilter?: boolean;

    // localStorageConfig is config used to stored results of edited rows
    //localStorageConfig?: LocalStorageConfig;

    // localStorageKeyForEditedRows is key used to store edited rows into local storage
    localStorageKeyForEditedRows?: string;

    // Callback to invoke when a cell switches to edit mode
    //
    // Default: Empty function
    onEditInit?: (event: EditEvent, componentRef: any) => void;

    // Callback to invoke when cell edit is completed
    //
    // Default: Empty function
    onEditComplete?: (event: EditEvent, componentRef: any) => void;

    // Callback to invoke when cell edit is cancelled with escape key
    //
    // Default: Empty function
    onEditCancel?: (event: EditEvent, componentRef: any) => void;

    pagination?: PrimengPagination;
}

export interface PrimengTablePagination extends BasePagination {
    paginatorPosition?: 'top' | 'bottom' | 'both'
}

interface outputTemplateConfig {
    updateOutputTemplate: boolean;
    rowIdx: number;
    field: string;
}

@Component({
    selector: 'lib-primeng-table',
    templateUrl: './primeng-table.component.html',
    styleUrls: ['./primeng-table.component.scss']
})
export class PrimengTableComponent extends BaseTableComponent implements OnInit {
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
    private _inputTemplateSub: Subscription = new Subscription();

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

    // _bodyCellSubs is used to keep reference to explicitly body cell subscriptions
    // and will properly unsubscribe from them when new data is loaded into table
    private _bodyCellSub: Subscription = new Subscription();

    // _onTableFilterEvent is used by other components of the table like caption,
    // column filter and body cell rows and will be emitted by table whenever
    // new data is loaded into the table via column filter or pagination
    private _onTableFilterEvent: EventEmitter<BaseTableEvent> = new EventEmitter<any>();

    // _onClearFiltersEvent is used by other components of the table like caption,
    // column filter and body cell rows and will be emitted by table whenever
    // the "Clear Filter Button" is triggered
    private _onClearFiltersEvent: EventEmitter<BaseTableEvent> = new EventEmitter<any>();

    // _onSortEvent is triggered whenever a sort event occurs on a column
    private _onSortEvent: EventEmitter<BaseTableEvent> = new EventEmitter<any>();

    // columnFilterCrs keeps a list of references to dynamically created column filters
    // components which can be modified through different events and will be destroyed on 
    // component destruction
    public columnFilterCrs: ComponentRef<BaseColumnComponent>[] = [];

    // rowExpansionCrs keeps a list of references to dynamically created expanded row
    // components which can be modified through different events and will be destroyed on 
    // component destruction
    public rowExpansionCrs: ComponentRef<BaseRowExpansionComponent>[] = [];

    // bodyCellCrs keeps a list of references to dynamically created body cell 
    // which can be modified through different events and will be destroyed on 
    // component destruction
    public bodyCellCrs: ComponentRef<BaseColumnComponent>[] = [];

    // outputTemplateCrMap keeps a list of references to dynamically created output template
    // which can be modified through different events and will be destroyed on 
    // component destruction
    public outputTemplateCrMap: Map<number, Map<string, ComponentRef<BaseColumnComponent>>> = new Map();

    // captionCr keeps a reference to dynamically created caption component which can be 
    // modified through different events and will be destroyed on component destruction
    public captionCr: ComponentRef<BaseTableCaptionComponent>;

    // summaryCr keeps a reference to dynamically created summary component which can be 
    // modified through different events and will be destroyed on component destruction
    //public summaryCr: ComponentRef<BaseTable>;

    public tableCellDirMap: Map<number, Map<string, TableCellDirective>> = new Map();

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
    //@Input() public renderCallback: EventEmitter<any> = new EventEmitter<any>();

    // config is variable that stores all configuration for table
    @Input() public config: PrimengTableConfig;

    @ViewChild('dt', { static: false }) public dt: Table;
    // @ViewChild(TableCaptionDirective, { static: false })
    // public headerCaptionDir: TableCaptionDirective;
    // @ViewChildren(TableExpansionDirective)
    // public expansionDirs: QueryList<TableExpansionDirective>;
    // @ViewChildren(TableBodyCellDirective)
    // public bodyCellDirs: QueryList<TableBodyCellDirective>;
    // @ViewChildren(TableInputTemplateDirective)
    // public inputTemplateDirs: QueryList<TableInputTemplateDirective>;
    // @ViewChildren(TableOutputTemplateDirective)
    // public outputTemplateDirs: QueryList<TableOutputTemplateDirective>;
    // @ViewChildren(TableColumnFilterDirective)
    // public columnFilterDirs: QueryList<TableColumnFilterDirective>;
    // @ViewChildren(TableCellDirective)
    // public tableCellDirs: QueryList<TableCellDirective>;

    @ViewChildren(PrimengSortIconComponent) public sortIcons: QueryList<PrimengSortIconComponent>;
    @ViewChildren(SortableColumn) public sortColumns: QueryList<SortableColumn>;

    // defaultProperty is the default property used to be set for primeng's table "dataKey" property
    public defaultProperty: string = 'id';

    // exportItems is used to display multiple export format options within a single button
    //public exportItems: MenuItem[];

    // visibleColumns keeps track of the total number of visible columns
    // This is needed for when we use row expansion, the UI needs to know how
    // many columns are in the "above" table in order to render correctly
    public visibleColumns: number = 0;

    public showNoRecordsLabel: boolean = false;

    // hasPagination will be set
    public hasPagination: boolean = true;

    // state keeps track of the current table's filter state and is the info that is 
    // sent to the server whenever a column filter is used or pagination occurs
    public state: State = getDefaultState();

    public columns: PrimengColumn[];

    constructor(
        public cdr: ChangeDetectorRef,
        public cfr: ComponentFactoryResolver,
        public http: HttpService,
    ) { super(cdr, cfr, http) }

    ///////////////////////////////////////////
    // INIT DEFAULT VALUES
    ///////////////////////////////////////////

    // initValues takes the passed config and sets default values
    // if the values are undefined
    private initValues() {
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
        if (this.config.pagination == undefined) {
            this.hasPagination = false;
            this.config.pagination = {}
        } else {
            if (this.config.pagination.pageSize == undefined) {
                this.config.pagination.pageSize = 20;
            }
            if (this.config.pagination.pageSizeOptions == undefined) {
                this.config.pagination.pageSizeOptions = [20, 50, 100];
            }
            if (this.config.pagination.paginatorPosition == undefined) {
                this.config.pagination.paginatorPosition = 'bottom';
            }
        }
        if (this.config.loading == undefined) {
            this.config.loading = true;
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

        const pCfg = getDefaultParamConfig();

        if (this.config.paramConfig == undefined) {
            this.config.paramConfig = {};
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

        if (this.config.state != undefined) {
            this.state = this.config.state
        } else if (this.config.getState != undefined) {
            this.state = this.config.getState(this.outerData);
        }

        // if (this.config.resetEditedRowsOnTableFilter == undefined) {
        //     this.config.resetEditedRowsOnTableFilter = true;
        // }
    }

    // initDefaultTableValues initializes default values for table 
    // if not provided by config
    private initDefaultTableValues() {
        this.dt.scrollHeight = this.config.scrollHeight;
        this.dt.resizableColumns = this.config.resizableColumns;
        this.dt.dataKey = this.config.dataKey;
        this.dt.rows = this.config.pagination.pageSize
        this.dt.showCurrentPageReport = this.config.showCurrentPageReport;
        this.dt.rowsPerPageOptions = this.config.pagination.pageSizeOptions;
        this.dt.loading = this.config.loading;
        this.dt.paginator = this.hasPagination;
        this.dt.scrollable = this.config.scrollable;
        this.dt.editMode = this.config.editMode;
        this.dt.currentPageReportTemplate = this.config.currentPageReportTemplate;

        const columns: PrimengColumn[] = [];

        for (let i = 0; i < this.config.columns.length; i++) {
            const col: PrimengColumn = deepCopyPrimengColumn(this.config.columns[i])

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

        this.dt.columns = columns;
        this.columns = columns;
        this.cdr.detectChanges();
    }

    ///////////////////////////////////////////
    // FILTER FUNCTIONALITY
    ///////////////////////////////////////////

    // getGridInfo is responsible for actually querying the server
    // The update() function should be used to call this indirectly
    //
    // url: The encoded url to call against server
    protected getGridInfo(url: string) {
        this.http.get<any>(
            url,
            this.config.tableAPIConfig.apiOptions,
        ).subscribe(r => {
            const res = r as HttpResponse<FilterData>;

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
            // this._onEvent.emit({
            //     eventType: DefaultTableEvents.TableFilter,
            //     event: res
            // });

            const bte: BaseTableEvent = {
                event: res
            }

            this._onTableFilterEvent.emit(bte);
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
        super.clearFilters();
        this.resetSortIcons();
    }

    ///////////////////////////////////////////
    // EDIT FUNCTIONALITY
    ///////////////////////////////////////////

    // private unsubscribeTemplateCells() {
    //     this._inputTemplateSubs.forEach(x => {
    //         x.unsubscribe();
    //     })
    //     this._inputTemplateSubs = [];
    // }

    public onEditInit(event: EditEvent) {
        console.log('edit init row data');
        console.log(event.data);
        this._currentEditedRow = event.data;

        if (this.config.onEditInit != undefined) {
            this.config.onEditInit(event, this);
        }
    }

    public onEditCancel(event: EditEvent) {
        this._inputTemplateSub.unsubscribe();

        if (this.config.onEditCancel != undefined) {
            this.config.onEditCancel(event, this);
        }
    }

    public onEditComplete(event: EditEvent) {
        console.log('edit complete row data');
        console.log(event.data);

        this._inputTemplateSub.unsubscribe();
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
        // this._onEvent.emit({
        //     eventType: DefaultTableEvents.Sort,
        //     event: event.field
        // })

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

    // toast adds ability to have a toast message based on message passed
    public toast(msg: Message) {
        //this.messageService.add(msg);
    }

    ///////////////////////////////////////////
    // INIT COMPONENT
    ///////////////////////////////////////////

    public ngOnInit(): void {
        super.ngOnInit();
        this.initValues();
    }

    public ngAfterViewInit() {
        this.initAfterView();
    }

    ///////////////////////////////////////////
    // EXPORT FUNCTIONS
    ///////////////////////////////////////////

    public exportData(typ: ExportType, url: string, fileName: string) {
        let fileType: string;
        const blobOpts = {
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
            const req = r as HttpResponse<any>
            const newBlob = new Blob([req.body], blobOpts);

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

        this._sub.unsubscribe();
        this._bodyCellSub.unsubscribe();

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
