import { Type, EventEmitter, SimpleChanges, OnInit, OnDestroy, Component, Input, Output } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { Table } from 'primeng/table/table'
import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { SelectItem, MessageService, Message, MenuItem } from 'primeng/api';
import { DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { BaseTableComponent } from './components/base-table/base-table.component';
import { MultiSelectModule } from 'primeng';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DefaultConsts } from './config';

//---------------- FILTERS ----------------------- 

// FilterData is default interface used for returning data from server
export interface FilterData {
    data: any[],
    total: number,
}

export interface SortDescriptor {
    /**
     * The field that is sorted.
     */
    field: string;
    /**
     * The sort direction. If no direction is set, the descriptor will be skipped during processing.
     *
     * The available values are:
     * - `asc`
     * - `desc`
     */
    dir?: 'asc' | 'desc';
}

export interface CompositeFilterDescriptor {
    /**
     * The logical operation to use when the `filter.filters` option is set.
     *
     * The supported values are:
     * * `"and"`
     * * `"or"`
     */
    logic: 'or' | 'and';
    /**
     * The nested filter expressions&mdash;either [`FilterDescriptor`]({% slug api_kendo-data-query_filterdescriptor %}), or [`CompositeFilterDescriptor`]({% slug api_kendo-data-query_compositefilterdescriptor %}). Supports the same options as `filter`. You can nest filters indefinitely.
     */
    filters: Array<FilterDescriptor | CompositeFilterDescriptor>;
}

export interface State {
    /**
     * The number of records to be skipped by the pager.
     */
    skip?: number;
    /**
     * The number of records to take.
     */
    take?: number;
    /**
     * The descriptors used for sorting.
     */
    sort?: Array<SortDescriptor>;
    /**
     * The descriptors used for filtering.
     */
    filter?: CompositeFilterDescriptor;
    /**
     * The descriptors used for grouping.
     */
    group?: Array<GroupDescriptor>;
}

export interface FilterDescriptor {
    /**
     * The data item field to which the filter operator is applied.
     */
    field?: string | Function;
    /**
     * The filter operator (comparison).
     *
     * The supported operators are:
     * * `"eq"` (equal to)
     * * `"neq"` (not equal to)
     * * `"isnull"` (is equal to null)
     * * `"isnotnull"` (is not equal to null)
     * * `"lt"` (less than)
     * * `"lte"` (less than or equal to)
     * * `"gt"` (greater than)
     * * `"gte"` (greater than or equal to)
     *
     * The following operators are supported for string fields only:
     * * `"startswith"`
     * * `"endswith"`
     * * `"contains"`
     * * `"doesnotcontain"`
     * * `"isempty"`
     * * `"isnotempty"`
     */
    operator: string | Function;
    /**
     * The value to which the field is compared. Has to be of the same type as the field.
     */
    value?: any;
    /**
     * Determines if the string comparison is case-insensitive.
     */
    ignoreCase?: boolean;
}

export interface GroupDescriptor {
    /**
     * The data item field by which the data will be grouped.
     */
    field: string;
    /**
     * The sort order of the group.
     */
    dir?: 'asc' | 'desc';
    /**
     * The aggregates which are calculated during grouping.
     */
    aggregates?: Array<AggregateDescriptor>;
}

export interface AggregateDescriptor {
    /**
     * The name of the record field on which the function will be executed.
     */
    field: string;
    /**
     * The aggregate function that will be calculated.
     */
    aggregate: 'count' | 'sum' | 'average' | 'min' | 'max';
}

//---------------- MISC ----------------------- 

export interface FieldName {
    oldName: string;
    newName: string;
}

export const BoolList: SelectItem[] = [
    {
        label: '--Select--',
        value: null,
    },
    {
        label: 'True',
        value: true,
    },
    {
        label: 'False',
        value: false,
    }
]


// HTTPOptions is just a type safe way of applying api options
// to HTTPClient#get parameter
export interface HTTPOptions {
    headers?: HttpHeaders
    observe?: 'body' | 'response' | 'events';
    params?: HttpParams
    reportProgress?: boolean;
    responseType?: 'json' | 'blob';
    withCredentials?: boolean;
}

// ExportMenuItem extends MenuItem to add our exportAPI function
// and fileName property
// This is mainly used in the "ExportFormats" interface which is used
// for the BaseTableConfig#exportConfig property setting
//
// The "command" function of MenuItem is overwritten when used in 
// BaseTableConfig#exportConfig property setting to handle the appropriate
// export type in "ExportFormats"
export interface ExportMenuItem extends MenuItem {
    // exportAPI takes in outerData and should return url that will be used 
    // to query server to download current format in "ExportFormats" interface
    exportAPI: (outerData: any) => string;

    // fileName should be the name you want the file to be named when 
    // downloaded (without extension as api will handle that based on format)
    // Ex: "test" NOT "test.csv"
    fileName: string;
}

// ExportType is enum that is mainly used for the 
// BaseTableComponent#exportButton function
//
// It determines which file type to export to with current table info
export enum ExportType {
    // csv will export to the .csv file type
    csv = 1,

    // xls will export to .xsl format
    xls,

    // xlsx will export to .xslx format
    xlsx
}

// TableCaptionExportConfig is optional config that can be used in a custom table
// caption to have ability to export table info
//
// This config is intended to be used in conjunction with BaseTableComponent#exportData function
export interface TableCaptionExportItem {
    // url of intended request
    url: string;

    // fileName is name of file that user will see downloaded
    fileName: string;

    // columnHeadersParam is parameter sent to server to determine
    // what columns to export from table
    columnHeadersParam: string;

    // idFilterParam is parameter sent to server to determine
    // what specific rows should be exported based on ids sent
    idFilterParam: string;
}

// TableCaptionExportConfig is config 
export interface TableCaptionExportConfig {
    // url for csv file
    csvURL?: string;

    // url for xls file
    xlsURL?: string;

    // url for xlsx file
    xlsxURL?: string;

    // fileName is name of file that user will see downloaded
    fileName: string;

    // columnHeadersParam is parameter sent to server to determine
    // what columns to export from table
    columnHeadersParam: string;

    // idFilterParam is parameter sent to server to determine
    // what specific rows should be exported based on ids sent
    idFilterParam: string;
}

// ExportConfig is config used in BaseTableConfig to construct
// settings to use for the export button like styling, file name,
// file format etc.
export interface ExportConfig {
    // fieldsParam is the name of the parameter that will be sent to server 
    // with the selected checkbox column values to export to selected format
    // 
    // Default value: "headers"
    fieldsParam?: string;

    // exportFormats is for configuring which formats the table is able 
    // to export to
    exportFormats: ExportFormats;
}

// ExportFormats is configuration used to determine which file types to export to
export interface ExportFormats {
    // csv's "exportAPI" function should return url that will download .csv file
    // for current table info
    csv?: ExportMenuItem;

    // xls's "exportAPI" function should return url that will download .xls file
    // for current table info
    xls?: ExportMenuItem;

    // xlsx's "exportAPI" function should return url that will download .xlsx file
    // for current table info
    xlsx?: ExportMenuItem;
}

// SortOperation is configuration used to determine how a column is sorted, if 
// it is disabled and which column field is sortable
export interface SortOperation {
    // sortField should be json representation of the field to sort
    sortField: string;

    // disableSort determines whether we disable ability to sort
    disableSort?: boolean;

    // sortOrder determines the sort order
    // Should either be 'asc' or 'desc'
    sortOrder?: string;
}

// BaseActionConfig is base config used for navigating when
// an action button like "create" or "edit" is clicked
export interface BaseActionConfig {
    // modal is config used to set up a modal component whenever 
    // an action button is clicked
    modalCfg?: BaseModalConfig;

    modal?: (component: any) => void;

    // pageURL is config used to take in rowData/outerData and 
    // should return url to navigate to
    pageURL?: (any) => string;

    // actionFn takes in BaseTableComponent and manipulates the
    // table based on passed function
    //
    // The main purpose of this function is to create/edit an
    // inline row in a table instead of using modal or redirecting
    // to different page
    actionFn?: (component: any) => void;
}

//---------------- MODAL CONFIGS ----------------------- 

// BaseModalConfig is config used to set up for modal settings
export interface BaseModalConfig {
    // component is component to generate within modal view
    component: Type<any>;

    // dialogConfig is config for modal
    dialogConfig?: any;

    // getDialogConfig is for creating config dynamically
    // Parameter passed should be outerData if exists for
    // whatever component you implement this function for
    getDialogConfig?: (any) => any

    // processOnClose takes in result from closing of modal
    // and updates table based on results
    processOnClose?: (result: any, baseTable: BaseTableComponent) => void
}

// ------------------ TABLE INTERFACES -----------------------

// BaseTableEventConfig is config that should be extended by all component's configs
// that emit an event
export interface BaseTableEventConfig {
    // eventFieldName should be unique name of event that is triggered by table component
    eventFieldName: string;
}

// BaseTableEvent should be the interface that is emitted from every event
// that occurs in table
//
// The eventFieldName that is extended from BaseTableEventConfig can be used
// as identifier of what kind of event has been emitted and use that to
// cast our "event" property to appropriate type
export interface BaseTableEvent extends BaseTableEventConfig {
    // event should be custom event type that can be used by event listeners
    event?: any;
}

// ParamConfig is config used to determine different param names that will
// be sent to server for filtering, sorting, and grouping
export interface ParamConfig {
    // take is parameter used to get a certain number of records
    take?: string;

    // skip is parameter used to skip certain number of records
    skip?: string;

    // filters is parameter used to apply filters for specific results
    filters?: string;

    // sorts is parameter used to apply sorts to certain columns
    sorts?: string;

    // groups is parameter used to apply groups to certain columns
    groups?: string
}

// BaseTableCaptionConfig is base config settings that will typically
// be used in a standard table caption
export interface BaseTableCaptionConfig {
    // showRefreshBtn determines whether to show refresh button
    showRefreshBtn?: boolean;

    // showClearFiltersBtn determines whether to show clear filter button
    showClearFiltersBtn?: boolean;

    // showCollapseBtn determines whether to show collapse button
    showCollapseBtn?: boolean;

    // showColumnSelect determines whether to show column select
    // where users can hide and show certain columns
    showColumnSelect?: boolean;


    exportCfg?: TableCaptionExportConfig;
    createCfg?: BaseActionConfig;
}

// BaseTableConfig is the main config that is used against our table api
export interface BaseTableConfig extends BaseEventOptions {
    // getState is the filter state of the table that will be sent to server
    // Setting this will set the table with initial state when making
    // first call to server
    getState?: (outerData: any) => State;

    // summary is config used to generate custom summary component
    summary?: Summary;

    // paramConfig set param names that will be sent to server
    paramConfig?: ParamConfig;

    // tableAPIConfig makes api call based on given url and applies to table
    tableAPIConfig?: APIConfig;

    // tableSettingsAPIConfig makes an api call based on given url and applies the results
    // to column filter values specified
    tableSettingsAPIConfig?: APIConfig;

    // columns is where we dynamically create columns with configuration
    columns?: Column[];

    // exportConfig is config to allow to export table info to different 
    // formats such as csv, excel, etc
    exportConfig?: ExportConfig;

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

    // showCaption determines if we show caption header or not
    //
    // Default: true
    showCaption?: boolean;

    // hasColGroup determines if we have column group enabled
    //
    // Default: true
    hasColGroup?: boolean;

    // rowExpansion is ability to inject component into table expansion to
    // display related items of particular row
    rowExpansion?: RowExpansion;

    // caption is ability to inject component into table caption header
    caption?: Caption;

    // Height of the scroll viewport in fixed pixels or the "flex" keyword for a dynamic size.
    // 
    // Default: '550px'
    scrollHeight?: string;

    // A property to uniquely identify a record in data
    //
    // Default: 'id'
    dataKey?: string;

    // Number of rows to display per page.
    //
    // Default: 20
    rows?: number;

    // Whether to display current page report
    //
    // Default: true
    showCurrentPageReport?: boolean;

    // Array of integer/object values to display inside rows per page dropdown of paginator
    //
    // Default: [20, 50, 100]
    rowsPerPageOptions?: number[];

    // Displays a loader to indicate data load is in progress
    //
    // Default: true
    loading?: boolean;

    // When specified as true, enables the pagination
    //
    // Default: true
    paginator?: boolean;

    // Position of the paginator, options are "top","bottom" or "both"
    //
    // Default: bottom
    paginatorPosition?: 'top' | 'bottom' | 'both'

    // Defines if data is loaded and interacted with in lazy manner
    //
    // Default: true
    lazy?: boolean;

    // When specifies, enables horizontal and/or vertical scrolling
    //
    // Default: true
    scrollable?: boolean;

    // Determines if columns are resizable by user
    //
    // Default: false
    resizableColumns?: boolean;

    // columnResizeMode determines whether if the overall table expands
    // when a column is resized or stays fit
    // columnResizable must be set in order for this to work
    //
    // Default: fit
    columnResizeMode?: 'expand' | 'fit'

    // autosearch enables/disables ability for table to automatically update
    // whenever user changes any column filters without having to explicitly
    // hit a search button
    //
    // Default: true
    autoSearch?: boolean;

    // Template of the current page report element. 
    // Available placeholders are {currentPage},{totalPages},{rows},{first},{last} and {totalRecords} 
    // Default: 'Showing {first} to {last} of {totalRecords} entries'
    currentPageReportTemplate?: string;

    // editMode determines whether we are editing by cell or entire row
    //
    // Default: undefined
    editMode?: 'row' | 'cell';

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
    onEditInit?: (event: EditEvent, baseTable: BaseTableComponent) => void;

    // Callback to invoke when cell edit is completed
    //
    // Default: Empty function
    onEditComplete?: (event: EditEvent, baseTable: BaseTableComponent) => void;

    // Callback to invoke when cell edit is cancelled with escape key
    //
    // Default: Empty function
    onEditCancel?: (event: EditEvent, baseTable: BaseTableComponent) => void;

    // customTableSearch is for overriding the default search functionality built into the table itself
    // when searching for entries of external datasource
    //
    // Default: undefined
    customTableSearch?(baseTable: BaseTableComponent): void;

    // customTableSearch is for overriding the default search functionality built into the table itself
    // when searching for table settings of external datasource
    //
    // Default: undefined
    customTableSettingsSearch?(baseTable: BaseTableComponent): void;

    // outerDataHeader is used for inner tables where outerData is the data passed
    // from the "above" table and can be used to display a header for the inner table
    // This is useful for a visual cue when you have several inner tables open, it can
    // get overwhelming on what table you are currently looking at
    outerDataHeader?: (outerData: any) => string;
}

// ------------------ COLUMN CONFIGURATION -----------------------

//////////////////////////////////////////////////////////////////////////////////
// The below configurations are used in the column api to set up
// various functionality for a column
// There are interfaces and corresponding concrete clases that implement those 
// interfaces although all the interfaces have optional properties
// This is used in our "COLUMN IMPLEMENTATION" section and the reason the
// interface properties are all optional is so they don't have to be set 
// when using the column api and the concrete classes simply take in the 
// properties that are set and use them in the dynamically created components
//
// There are built in components with different styles but if one wanted to 
// implement custom components, one would simply need to extend the concrete
// classes below
//////////////////////////////////////////////////////////////////////////////////

// BaseTableItemsI is base interface config used for column api
// This config should be extended by various parts of the table api
// like caption, column header etc.
export interface BaseTableItemsI {
    config?: any;
}

@Component({
    template: '',
})
export class BaseTableItems implements BaseTableItemsI, OnInit, OnDestroy {
    protected _subs: Subscription[] = [];

    @Input() public config: any;
    @Input() public baseTable: BaseTableComponent;
    @Output() public onEvent: EventEmitter<any>;

    public processInputTemplateEvent: (event: any, baseTable: BaseTableComponent) => void;
    public processBodyCellEvent: (event: any, baseTable: BaseTableComponent) => void;
    public processCaptionEvent: (event: any, baseTable: BaseTableComponent) => void;
    public processTableFilterEvent: (event: any, baseTable: BaseTableComponent) => void;
    public processColumnFilterEvent: (event: any, baseTable: BaseTableComponent) => void;
    public processClearFiltersEvent: (event: any, baseTable: BaseTableComponent) => void;
    public processSortEvent: (event: any, baseTable: BaseTableComponent) => void;

    constructor() { }

    public ngOnInit() { }

    public ngOnDestroy() {
        this._subs.forEach(item => {
            item.unsubscribe()
        })
        this._subs = null;
    }
}

export interface BaseCaptionItemsI extends BaseTableItemsI {
    outerData?: any;
}

@Component({
    template: '',
})
export class BaseCaptionItems extends BaseTableItems implements BaseCaptionItemsI, OnInit, OnDestroy {
    protected _createSub: Subscription;

    public outerData: any;

    constructor() {
        super()
    }

    public ngOnInit() {

    }

    public ngOnDestroy() {
        super.ngOnDestroy();

        if (this._createSub != undefined && !this._createSub.closed) {
            this._createSub.unsubscribe();
        }

        this._createSub = null;
    }
}

@Component({
    template: '',
})
export class BaseTableCaptionComponent extends BaseCaptionItems implements BaseCaptionItemsI, OnInit, OnDestroy {
    @Output() public onRefresh: EventEmitter<any> = new EventEmitter<any>();
    @Output() public onClearFilters: EventEmitter<any> = new EventEmitter<any>();
    @Output() public onCloseRows: EventEmitter<any> = new EventEmitter<any>();
    @Output() public onColumnFilterChange: EventEmitter<string> = new EventEmitter<string>();
    @Output() public onCreate: EventEmitter<BaseActionConfig> = new EventEmitter<BaseActionConfig>();
    @Output() public onExport: EventEmitter<any> = new EventEmitter<any>();

    private _tcCfg: BaseTableCaptionConfig;

    // _rowMap is used for keeping track of what rows are currently selected
    // to be able to export those selected rows
    protected _rowMap: Map<number, string> = new Map();

    // _selectedColsMap is a map that keeps track of selected columns
    // by field namae to properly show and hide columns
    protected _selectedColsMap: Map<string, boolean> = new Map();

    public selectedColumns: any[] = [];

    // columnOptions will be the available options to select from dropdown
    // to hide and show columns
    public columnOptions: SelectItem[] = [];

    constructor(
        public router: Router,
    ) {
        super();
    }

    private initConfig() {
        if (this.config == undefined) {
            let cfg: BaseTableCaptionConfig = {
                showRefreshBtn: true,
                showClearFiltersBtn: true,
                showCollapseBtn: true,
                showColumnSelect: true,
                exportCfg: {
                    csvURL: '',
                    xlsURL: '',
                    xlsxURL: '',
                    fileName: '',
                    columnHeadersParam: '',
                    idFilterParam: '',
                }
            }

            this.config = cfg;
        } else {
            this._tcCfg = this.config
        }
    }

    private initColumnFilterSelect() {
        let columns: Column[] = this.baseTable.dt.columns;

        columns.forEach(x => {
            if (x.showColumnOption) {
                this.columnOptions.push({
                    value: x.field,
                    label: x.header,
                });

                if (x.hideColumn) {
                    this._selectedColsMap.set(x.field, false);
                } else {
                    this.selectedColumns.push(x.field);
                    this._selectedColsMap.set(x.field, true);
                }

            }
        })
    }

    public ngOnInit(): void {
        this.initConfig();
        this.initColumnFilterSelect();
    }

    public closeRows() {
        this.baseTable.closeExpandedRows();
        this.onCloseRows.emit(null);
    }

    public clearFilters() {
        this.baseTable.clearFilters();
        this.onClearFilters.emit(null);
    }

    public refresh() {
        this.baseTable.refresh();
        this.onRefresh.emit(null);
    }

    public columnFilterChange(val: string) {
        if (this._selectedColsMap.get(val)) {
            this.baseTable.addHiddenColumn(val);
            this._selectedColsMap.set(val, false);
        } else {
            this.baseTable.removeHiddenColumn(val);
            this._selectedColsMap.set(val, true);
        }

        this.onColumnFilterChange.emit(val)
    }

    public create() {
        if (this._tcCfg.createCfg.pageURL != undefined) {
            this.router.navigateByUrl(this._tcCfg.createCfg.pageURL(this.baseTable.outerData));
        } else if (this._tcCfg.createCfg.modal != undefined) {
            this._tcCfg.createCfg.modal(this.baseTable);
        } else if (this._tcCfg.createCfg.actionFn != undefined) {
            this._tcCfg.createCfg.actionFn(this.baseTable);
        }
    }

    public export(et: ExportType) {
        let url: string;

        switch (et) {
            case ExportType.csv:
                et = ExportType.csv
                url = this._tcCfg.exportCfg.csvURL;
                break;
            case ExportType.xls:
                et = ExportType.xls
                url = this._tcCfg.exportCfg.xlsURL;
                break;
            case ExportType.xlsx:
                et = ExportType.xlsx
                url = this._tcCfg.exportCfg.xlsxURL;
                break;
        }

        let headers: string[] = [];

        this._selectedColsMap.forEach((v, k) => {
            if (v) {
                headers.push(k);
            }
        })

        if (this._rowMap.size == 0) {
            url += this.baseTable.getFilterParams() + '&' + this._tcCfg.exportCfg.columnHeadersParam + '=' +
                encodeURI(JSON.stringify(headers));
        } else {
            let ids = [];
            this._rowMap.forEach((v, k) => {
                ids.push(v)
            })

            let filter: FilterDescriptor = {
                field: this._tcCfg.exportCfg.idFilterParam,
                operator: 'eq',
                value: ids
            }

            url += '?' + this._tcCfg.exportCfg.columnHeadersParam + '=' + encodeURI(JSON.stringify(headers)) + '&' +
                this.baseTable.config.paramConfig.filters + '=' +
                encodeURI(JSON.stringify([filter])) + '&' + this.baseTable.config.paramConfig.sorts + '=' +
                encodeURI(JSON.stringify(this.baseTable.state.sort));
        }

        this.baseTable.exportData(et, url, this._tcCfg.exportCfg.fileName);
    }

    public ngOnDestroy() {
        super.ngOnDestroy();
    }
}

export interface BaseColumnItemsI extends BaseTableItemsI {
    field?: string;
    value?: any;
    selectedValue?: any;
    getSelectedValue?: (rowData: any) => any;
    operator?: string;
    processRowData?: (rowData: any) => any;
    excludeFilter?: boolean;
}

@Component({
    template: '',
})
export class BaseColumnItems extends BaseTableItems implements BaseColumnItemsI, OnInit, OnDestroy {
    @Input() public field: string;
    @Input() public colIdx: number;
    @Input() public value: any;
    @Input() public selectedValue: any;
    @Input() public rowIdx: number;
    @Input() public rowData: any;
    @Input() public operator: string;
    @Input() public isColumnFilter: boolean;
    @Input() public isInputTemplate: boolean;
    @Input() public excludeFilter: boolean;
    @Input() public processRowData: (rowData: any) => any;

    protected emitFilterChange(val: any) {
        let filter: FilterDescriptor = {
            value: val,
            field: this.field,
            operator: this.operator,
        }
        let cfg: BaseTableEvent = {
            eventFieldName: this.field,
            event: filter,
        }

        this.onEvent.emit(cfg);
    }

    public clearFilter() {
        this.selectedValue = null;
    }

    public onFilterChange(event: string) {
        this.operator = event;

        if (this.isColumnFilter) {
            this.emitFilterChange(this.selectedValue);
        }
    }

    constructor() {
        super();

        if (this.operator == undefined) {
            this.operator = 'eq';
        }
    }

    public ngOnInit() {
        super.ngOnInit();
    }
}

export interface RowExpansionItemsI {
    config?: any;
    renderCallback?: EventEmitter<any>
    outerData?: any;
}

@Component({
    template: '',
})
export class RowExpansionItems implements RowExpansionItemsI {
    public config: any;
    public renderCallback: EventEmitter<any>;
    public outerData: any;
}

// ---------------- COLUMN IMPLEMENTATION ------------------

// Caption is used to display caption component in caption part of table
export interface Caption extends BaseTableItemsI {
    component: Type<BaseCaptionItems>;
}

export interface ColumnEntity extends BaseColumnItemsI {
    component: Type<BaseColumnItems>;
}

// RowExpansion is used to display expansion component of table
export interface RowExpansion extends RowExpansionItemsI {
    // component is component to use for expansion of table
    component: Type<RowExpansionItems>;
}

export interface Summary extends BaseTableItemsI {
    component: Type<BaseTableItems>;
}

// ------------------ COLUMN CONFIGS -----------------------

export interface MultiSelectOptions {
    // Inline style of the element
    style?: Object;

    // Height of the viewport in pixels, a scrollbar is defined if height of list exceeds this value
    //
    // Default: 200px
    scrollHeight?: string;

    // Style class of the element
    styleClass?: string;

    // Decides how many selected item labels to show at most
    //
    // Default: 3
    maxSelectedLabels?: number;

    // Label to display after exceeding max selected labels
    //
    // Default: {0} items selected
    selectedItemsLabel?: string;

    // Whether to show the checkbox at header to toggle all items at once
    //
    // Default: true
    showToggleAll?: boolean;

    // Clears the filter value when hiding the dropdown
    //
    // Default: false
    resetFilterOnHide?: boolean;

    // Whether to show the header
    // 
    // Default: true
    showHeader?: boolean;

    // The default label to display for select
    //
    // Default: 'Choose'
    defaultLabel?: string;
}

// APIConfig is base config used when making an http request
export interface APIConfig {
    // apiURL should return url to make api based on rowData passed if possible
    apiURL: (rowData: any) => string

    // processResult processes successful response
    processResult?: (result: any, baseTable?: any) => any;

    // apiOptions is the options to set for HTTPClient#get function
    apiOptions?: HTTPOptions;

    // processError processes error response
    processError?: (err: any) => void
}

// BaseEventOptions is config that can be optionally be added to a config passed
// to different parts of table api such as caption, column filter, etc.
//
// The purpose of BaseEventOptions is to be able to listen to events on a per 
// column basis and should be used within the Column config
export interface BaseEventOptions {
    // processBodyCellEvent processes an event from body cell for current column
    // This function will only activate if bodyCell#field property is set 
    // to field that is exposed when a body cell creates an event which
    // should be based off the BaseTableEvent interface
    processBodyCellEvent?: (event: any, baseTable: BaseTableComponent) => void;

    // processCaptionEvent activates whenever an event is broadcast from the caption
    processCaptionEvent?: (event: any, baseTable: BaseTableComponent) => void;

    // processTableFilterEvent activates whenever the table changes data through
    // a column filter change, pagination etc.
    processTableFilterEvent?: (event: any, baseTable: BaseTableComponent) => void;

    // processColumnFilterEvent processes an event from column filter for current column
    // There is no need to make explicit api request within this function as the table
    // api will do this for us
    //
    // The main purpose of this function is to be able to do various checks and
    // potentially modify BaseTableComponent#state variable before it is sent to 
    // server by table api
    processColumnFilterEvent?: (event: any, baseTable: BaseTableComponent) => void;

    // processClearFiltersEvent activates whenever the "Clear Filters" button
    // is used by user
    processClearFiltersEvent?: (event: any, baseTable: BaseTableComponent) => void;

    // processSortEvent is activated whenever a column is sorted
    processSortEvent?: (event: any, baseTable: BaseTableComponent) => void;

    // processOuterEvent is activated whenever an event outside of the table
    // occurs but we may want to process it and modify something within the table
    processOuterEvent?: (event: any, baseTable: BaseTableComponent) => void;

    // processEditEvent is activated whenever an cell or row edit event occurs
    processInputTemplateEvent?: (event: any, baseTable: BaseTableComponent) => void;
}

// TemplateConfig is config used for cell/row editing and determines
// what the input and output template/component will be
export interface TemplateConfig {
    // inputTemplate is used to determine what input template will be
    // used for editing values
    inputTemplate: ColumnEntity;

    // outputTemplate is used to determine what output template will be
    // used when displaying info
    outputTemplate: ColumnEntity;
}

// EditEvent is config struct used whenever table is in edit mode
// and user activates edit mode by clicking on output template
export interface EditEvent {
    // data is rowData that is currently being edited
    data: any;

    // index is the row index that is currently being edited
    index: number;

    // field is the name of the current field being edited
    field: string;

    // foundDiff will be set true if the rowData has changed between
    // the activation of the onEditInit and onEditComplete functions
    foundDiff?: boolean;
}

// Column is the base settings interface that is used with base table component
// All settings that deal with columns should be set with this
export interface Column extends BaseEventOptions {
    // field represents json name of field
    // WE NEED FIELD FOR ABILITY TO EXPORT COLUMN, DO NOT DELETE
    field: string,

    // header represents display name of field
    header?: string,

    // renderColumnContent can be used to determine if the content in the table
    // cell is even rendered, NOT just hidden
    // This is used in conjunction with BaseTableAPI#showNoRecordsLabel and set by table api
    // but can be set manually if one wishes to not render cell content based on some condition
    //
    // Default: true
    renderColumnContent?: boolean;

    // hideColumn will hide column if set true
    hideColumn?: boolean,

    // showColumnOption will show current column
    // in the dropdown list in caption
    //
    // Default: true
    showColumnOption?: boolean;

    // hideColumnFilter will hide the filter for current column
    hideColumnFilter?: boolean;

    // colStyle will style col group if set.  This style should
    // really only be used to set width of column
    colStyle?: Object,

    // headerStyle styles header of column if set
    headerStyle?: Object;

    // headerClass will set CSS class for column header if set
    headerClass?: string;

    // headerStyle styles header of column if set
    headerFilterStyle?: Object;

    // headerClass will set CSS class for column header if set
    headerFilterClass?: string;

    // bodyCellStyle will set style for cell of column if set
    bodyCellStyle?: Object;

    // bodyCellClass will set CSS class for column cell if set
    bodyCellClass?: string;

    // columnFilter will display column filter and pass along config settings
    // to component if set
    columnFilter?: ColumnEntity;

    // bodyCell will display component within cell of table of current column
    // and pass config if set
    bodyCell?: ColumnEntity;

    // sort allows us to activate the ability to sort on current column
    sort?: SortOperation;

    // templateConfig is config used to set up inline edting for table
    // by configuring an input and output template
    templateConfig?: TemplateConfig;

    // bodyCellHTML takes in row value for that column and should
    // return html based on value if set
    // If neither bodyCell or bodyCellHTML is set, then the
    // row data will be displayed if "field" is set
    bodyCellHTML?: (any) => string;
}

// --------------------- TAB VIEW ----------------------

// TabViewConfig is config used for row expansion having inner tabs
export interface TabViewConfig {
    // selectedIdx is the tab panel that should be opened when tab view is first created
    selectedIdx: number;

    // panels is config settings for each tab panel in tab view
    panels: TabPanelItem[];
}

// TabPanelItem is config used for each tab within a collection of tab views
export interface TabPanelItem {
    // header is header for tab panel
    header?: string;

    // contentHTML is html content that will be loaded in tab panel
    contentHTML?: string;

    // contentComponent is the component that will be the generated within tab panel
    // This will override contentHTML
    contentComponent?: Type<RowExpansionItemsI>;

    // leftIcon will load css icon class to left of header
    leftIcon?: string;

    // rightIcon will load icon css class to left of header
    rightIcon?: string;

    // customHeader will display custom html in tab panel header if set
    customHeader?: string;

    // disabled will disable panel from being opened
    disabled?: boolean;

    // closable allows user to close panel from tab view
    closable?: boolean;

    // config can be used to set config for content component within panel
    config?: any;
}