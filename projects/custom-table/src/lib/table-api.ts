import { Type, EventEmitter, SimpleChanges, OnInit, OnDestroy, Component, Input } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { Table } from 'primeng/table/table'
import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { SelectItem, MessageService, Message, MenuItem } from 'primeng/api';
import { DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { BaseTableComponent } from './components/base-table/base-table.component';
import { MultiSelectModule } from 'primeng';

//---------------- FILTERS ----------------------- 

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

// ButtonOptions is configuration for basic styling of a button
export interface ButtonOptions {
    // icon represents icon for button
    icon?: string;

    // iconPos is which side the icon will appear
    iconPos?: 'left' | 'right';

    // styleClass should be space seperated classes to apply to class
    styleClass?: string;

    // style is applying css styling through javascript object
    style?: Object;
}

// BaseButton is basic styling options for button
export interface BaseButton {
    // label displays text for button
    label: string;

    // options is for various styling of button
    options?: ButtonOptions;
}

// ToggleButton allows us to set styles for toggle buttons
// This is mainly used for our "Show Columns" and "Hide Columns"
// buttons but can be used for any type of toggle buttons
// This does NOT implement any type of functionality, just styling
export interface ToggleButton {
    onButton: BaseButton;
    offButton: BaseButton;
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

// ExportConfig is config used in BaseTableConfig to construct
// settings to use for the export button like styling, file name,
// file format etc.
export interface ExportConfig {
    // fieldsParam is the name of the parameter that will be sent to server 
    // with the selected checkbox column values to export to selected format
    // 
    // Default value: "headers"
    fieldsParam?: string;

    // buttonCfg is config options to style the button
    buttonCfg?: BaseButton;

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

// BaseButtonConfig is base config used to determine which page to
// navigate to based on the rowData/outerData passed to function
export interface BaseButtonConfig {
    pageURL?: (rowData: any) => string;
}

// CreateActionConfig is config used in BaseTableConfig to determine 
// what action to take when clicking the "Create" button of a table,
// along with styling 
// 
// CreateActionConfig extends BaseButtonConfig and contains BaseModalConfig
// and will change functionality of the create button depending on which one is set
// If CreateActionConfig#createConfig is set then a modal will be used when 
// the create button is click, else we will be redirected to another page if clicked
// If both are set, modal will be used
export interface CreateActionConfig extends BaseButtonConfig, BaseButton {
    createConfig?: BaseModalConfig;
}

export interface EditActionConfig extends BaseButtonConfig {
    editConfig?: BaseModalConfig;
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

// DataTableConfig is config used to set up initial state of data table
export interface DataTableConfig {
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

    // Template of the current page report element. 
    // Available placeholders are {currentPage},{totalPages},{rows},{first},{last} and {totalRecords} 
    // Default: 'Showing {first} to {last} of {totalRecords} entries'
    currentPageReportTemplate?: string;
}

// BaseTableConfig is the main config that is used against our table api
export interface BaseTableConfig {
    // dt is used to override the defaults given within base table api
    dtConfig?: DataTableConfig;

    // tableAPIConfig makes api call based on given url and applies to table
    tableAPIConfig?: APIConfig;

    // tableSettingsAPIConfig makes an api call based on given url and applies the results
    // to column filter values specified
    tableSettingsAPIConfig?: APIConfig;

    // columns is where we dynamically create columns with configuration
    columns?: Column[];

    // columnSelect is multiselect component used to have ability to hide columns
    // and show columns
    // If not set, dropdown will not be displayed
    columnSelect?: MultiSelectOptions;

    // exportConfig is config to allow to export table info to different 
    // formats such as csv, excel, etc
    exportConfig?: ExportConfig;

    // refreshButton will display a refreshButton button if set so user can click this
    // to update table instead of having to do browser reset
    refreshButton?: BaseButton;

    // collapseRowsButton allows user to collapse all rows for current table if set
    collapseRowsButton?: BaseButton;

    // expandRowsButton allows user to expand all rows for current table if set
    expandRowsButton?: BaseButton;

    // clearFilterButton is config that allowed us to clear all column filters
    // within table
    // If this is NOT set, the clear filters button will not be displayed
    clearFilterButton?: BaseButton;

    // createNewConfig is configuration for create new button in the caption
    // of table which allows us to configure if we want the create to happen
    // in a modal or be redirected to another page
    // If this is NOT set, the create new button will not be displayed
    // By default, the table api will insert "outerData" and "isCreate" variables into our
    // dynamic modal config data variable like so:
    //
    // createNewConfig#createConfig#dialogConfig#data#outerData
    // createNewConfig#createConfig#dialogConfig#data#isCreate
    //
    // where outerData will be the current table's outerData variable which is set by table
    // api if current table is an inner table and isCreate is bool which is always true
    // Any variables assigned to the dynamic modal config data object with names "outerData"
    // or "isCreate" WILL be overwritten by the table's api
    createNewConfig?: CreateActionConfig;

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
    columnResizable?: boolean;

    // columnResizeMode determines whether if the overall table expands
    // when a column is resized or stays fit
    // columnResizable must be set in roder for this to work
    //
    // Default: fit
    columnResizeMode?: 'expand' | 'fit'

    // autosearch enables/disables ability for table to automatically update
    // whenever user changes any column filters without having to explicitly
    // hit a search button
    //
    // Default: true
    autoSearch?: boolean;

    // customSearch is for overriding the default search functionality built into table itself
    //
    // Default: undefined
    customSearch?(baseTable: BaseTableComponent): void;

    // Template of the current page report element. 
    // Available placeholders are {currentPage},{totalPages},{rows},{first},{last} and {totalRecords} 
    // Default: 'Showing {first} to {last} of {totalRecords} entries'
    currentPageReportTemplate?: string;

    // processColumnFilterEvent allows us to hook into all column filter
    // events and change the component based on whatever condition we want
    processColumnFilterEvent?: (event: any, baseTable: BaseTableComponent) => void;

    // processBodyCellEvent allows us to hook into all body cell
    // events and change the component based on whatever condition we want
    processBodyCellEvent?: (event: any, baseTable: BaseTableComponent) => void;

    // processCaptionEvent allows us to hook into a caption event
    processCaptionEvent?: (event: any, baseTable: BaseTableComponent) => void;

    // processTableFilterEvent allows us to hook into when the table is filtered
    // either by column filters or pagination
    processTableFilterEvent?: (event: HttpResponse<FilterData>, baseTable: BaseTableComponent) => void;

    // processClearFilterEvent allows us to hook into when the table is cleared by user
    processClearFilterEvent?: (event: HttpResponse<FilterData>, baseTable: BaseTableComponent) => void;

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
//////////////////////////////////////////////////////////////////////////////////

// BaseTableItemsI is base interface config used for column api
// This config should be extended by various parts of the table api
// like caption, column header etc.
export interface BaseTableItemsI {
    config?: any;
    onColumnFilterEvent?: EventEmitter<any>;
    onBodyCellEvent?: EventEmitter<any>;
    onCaptionEvent?: EventEmitter<any>;
    onTableFilterEvent?: EventEmitter<any>;
    onClearFiltersEvent?: EventEmitter<any>;
    onSortEvent?: EventEmitter<any>;
    baseTable?: BaseTableComponent;
}

@Component({
    template: '',
})
export class BaseTableItems implements BaseTableItemsI, OnInit, OnDestroy {
    @Input() public config: any;
    public onColumnFilterEvent: EventEmitter<any>;
    public onBodyCellEvent: EventEmitter<any>;
    public onCaptionEvent: EventEmitter<any>;
    public onTableFilterEvent: EventEmitter<any>;
    public onClearFiltersEvent: EventEmitter<any>;
    public onSortEvent: EventEmitter<any>;
    public baseTable: BaseTableComponent;

    protected _subs: Subscription[] = [];

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
    public outerData: any;

    protected _createSub: Subscription;

    constructor() {
        super()
    }

    public ngOnInit() {

    }

    public ngOnDestroy() {
        if (this._createSub != undefined && !this._createSub.closed) {
            this._createSub.unsubscribe();
        }

        this._subs.forEach(item => {
            item.unsubscribe()
        })

        this._createSub = null;
        this._subs = null;
    }
}

export interface BaseColumnItemsI extends BaseTableItemsI, BaseEventOptions {
    field?: string;
    colIdx?: number;
}

@Component({
    template: '',
})
export class BaseColumnItems extends BaseTableItems implements BaseColumnItemsI, OnInit, OnDestroy {
    public field: string;
    public colIdx: number;

    public processBodyCellEvent: (event: any, baseTable: BaseTableComponent) => void;
    public processCaptionEvent: (event: any, baseTable: BaseTableComponent) => void;
    public processTableFilterEvent: (event: any, baseTable: BaseTableComponent) => void;
    public processColumnFilterEvent: (event: any, baseTable: BaseTableComponent) => void;
    public processClearFiltersEvent: (event: any, baseTable: BaseTableComponent) => void;
    public processSortEvent: (event: any, baseTable: BaseTableComponent) => void;

    constructor() {
        super();
    }

    public ngOnInit() {
        super.ngOnInit();
    }
}

export interface BaseColumnFilterItemsI extends BaseColumnItemsI {
    value?: any;
    subComponents?: SubComponentConfig[];
    selectedValue?: any;
    operator?: string;
    rowIdx?: number;
    rowData?: any;
    clearFilter?: () => void;
    updateLabel?: (label: string) => void;
}

@Component({
    template: '',
})
export class BaseColumnFilterItems extends BaseColumnItems implements BaseColumnFilterItemsI, OnInit, OnDestroy {
    public value: any;
    public subComponents: SubComponentConfig[];
    public selectedValue: any;
    public operator: string;
    public rowIdx: number;
    public rowData: any;

    protected emitChange(val: any) {
        console.log('emitting change')
        console.log(val)
        let filter: FilterDescriptor = {
            value: val,
            field: this.field,
            operator: this.operator,
        }

        this.onColumnFilterEvent.emit(filter);

        if (this.config != undefined) {
            let cfg: BaseEventOptions = this.config;

            if (cfg.processColumnFilterEvent != undefined) {
                cfg.processColumnFilterEvent(filter, this.baseTable);
            }
        }
    }

    constructor() {
        super()
    }

    public clearFilter() {
        this.selectedValue = null;
    }

    public onChangeEvent(event: any) {
        this.emitChange(this.selectedValue)
    }

    public onFilterChange(event: string) {
        this.operator = event;
        this.onChangeEvent(null);
    }

    public ngOnInit() {
        this.operator = 'eq'
    }
}

export interface BaseBodyCellItemsI extends BaseColumnItemsI {
    rowIdx?: number;
    rowData?: any;
    processRowData?: (rowData: any) => any;
}

@Component({
    template: '',
})
export class BaseBodyCellItems extends BaseColumnItems implements BaseBodyCellItemsI, OnInit, OnDestroy {
    public rowIdx?: number;
    public rowData?: any;
    public processRowData?: (rowData: any) => any;

    constructor() {
        super();
    }

    public onChangeEvent(event: any) {
        this.onBodyCellEvent.emit(event)
    }
}

export interface RowExpansionItemsI {
    config?: any;
    renderCallback?: EventEmitter<any>
    outerData?: any;
}

// ---------------- COLUMN IMPLEMENTATION ------------------

// Caption is used to display caption component in caption part of table
export interface Caption extends BaseTableItemsI {
    component: Type<BaseTableItems>;
}

// ColumnFilter is used to display column filter component
export interface ColumnFilter extends BaseColumnFilterItemsI {
    // component is the column filter component to generate
    component: Type<BaseColumnFilterItems>;
}

// BodyCell is used to display component in cell of table
export interface BodyCell extends BaseBodyCellItemsI {
    // component is component to generate in cell of table
    component: Type<BaseBodyCellItems>;
}

// RowExpansion is used to display expansion component of table
export interface RowExpansion extends RowExpansionItemsI {
    // component is component to use for expansion of table
    component: Type<RowExpansionItemsI>;
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

export interface ColumnHeaderConfig {
    // headers should be a list of SelectItem where label is header name
    // and value should be name of column
    // Value of SelectItem should have the same value for each Column#field
    // property as this 
    headers: SelectItem[];

    // selectedValues is ability to choose which columns are visible during
    // page load or change in future
    // If not set, all options will be selected by default
    selectedValues?: any[];

    // options is styling options for the multiselect component
    options?: MultiSelectOptions;
}

// APIConfig is base config used when making an http request
export interface APIConfig {
    // apiURL should return url to make api based on rowData passed if possible
    apiURL: (rowData: any) => string

    // processResult processes successful response
    processResult?: (result: any, baseTable?: BaseTableComponent) => any;

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
}

// export interface BaseCaptionOptions extends BaseEventOptions{}

// export interface BaseColumnFilterOptions extends BaseEventOptions{
//     // field should be the json representation of column
//     field: string;

//     // subComponents allows user ablity to create a cascade of components
//     // within a dynamically created component
//     subComponents?: SubComponentConfig[];

//     // operator is the operator used in filtering data from server
//     operator?: string;

//     // selectedValue is the selected value(s) from the current column filter
//     selectedValue?: any;

//     // value is the default value set for column filter (if filter is input type)
//     // or is list of items (for filter that is a dropdown)
//     value?: any;

//     // clearFilter should implement zeroing out current column value
//     // This function works in conjunction with BaseTableComponent#clearFilters
//     // This should NOT be set in configuration but within the column
//     // filter class that extends BaseColumnFilterItems
//     clearFilter?: ()=>void;
// }

// export interface BaseBodyCellOptions extends BaseEventOptions{
//     // processRowData should take in rowData, process and return some 
//     // type of config to modify how component body cell is displayed
//     processRowData?: (rowData: any)=>any;
// }

// SubComponentConfig allows us to create cascading dynamic subcomponents
export interface SubComponentConfig {
    // component will be component to be generated of a dynamic parent component
    component: Type<any>;

    // config is config to be used against component
    config?: any;

    // subComponents is array of components to dynamically create
    subComponents?: SubComponentConfig[];
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
    columnFilter?: ColumnFilter;

    // bodyCell will display component within cell of table of current column
    // and pass config if set
    bodyCell?: BodyCell;

    // sort allows us to activate the ability to sort on current column
    sort?: SortOperation;

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