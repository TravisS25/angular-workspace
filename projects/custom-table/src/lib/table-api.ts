import { Type, EventEmitter, SimpleChanges, OnInit, OnDestroy, Component, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { Table } from 'primeng/table/table'
import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { MessageService, Message, MenuItem } from 'primeng/api';
import { IConfig } from 'ngx-mask';
import { BaseTableCaptionComponent } from './components/table/base-table-caption/base-table-caption.component';
import { BaseColumnFilterComponent } from './components/table/base-column-filter/base-column-filter.component';
import { BaseDisplayItemComponent } from './components/table/base-display-item/base-display-item.component';
import { BaseComponent } from './components/base/base.component';
import { BaseEventComponent } from './components/table/base-event/base-event.component';
import { BaseFormComponent } from './components/util/form/base-form/base-form.component';
import { FormGroup } from '@angular/forms';
import { BaseFormEventComponent } from './components/util/form/base-form-event/base-form-event.component';

//---------------- EVENT ENUMS ----------------------- 

export enum FormEvents {
    close = 1,
    submit,
    submitSuccess,
    submitError,
    formComplete,
}

export enum TableEvents {
    sort = 1,
    search,
    create,
    refresh,
    clearFilters,
    tableFilter,
    caption,
    columnFilter,
    tableCell,
    closeRows,
    export,
    summary,
}

export enum ActionEvents {
    mouseEnter = 1,
    mouseLeave,
    click
}

export const DefaultConsts = {
    CSVLabel: 'CSV',
    CreateNoteLabel: 'Create Note',
    EditLabel: 'Edit',
    DeleteLabel: 'Delete',
    CreateNewLabel: 'Create',
    SuccessCloseResult: 'success',
    SucessSeverity: 'success',
    TableModalConfig: 'tableModalConfig',
    DateFormat: 'YYYY-MM-DD',
    TokenHeader: 'X-Csrf-Token'
}

export const DefaultTableEvents = {
    Sort: 'sort',
    Search: 'search',
    Create: 'create',
    Refresh: 'refresh',
    ClearFilters: 'clearFilters',
    TableFilter: 'tableFilter',
    CaptionEntity: 'caption',
    ColumnFilter: 'columnFilter',
    BodyCell: 'tableCell',
    CloseRows: 'closeRows',
    Export: 'export',
    SummaryEntity: 'summary',
}

export const DefaultEvents = {
    MouseEnter: 'mounseEnter',
    MouseLeave: 'mouseLeave',
    Click: 'click',
}

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
    filters: Array<FilterDescriptor>;
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

export interface SelectItem {
    label: string;
    value: any;
}

export interface FieldName {
    oldName: string;
    newName: string;
}

// APIConfig is base config used when making an http request
export interface APIConfig {
    // apiURL should return url to make api based on rowData passed if possible
    apiURL: (rowData: any) => string

    // processResult processes successful response
    //processResult?: (result: any, componentRef?: any) => any;

    // apiOptions is the options to set for HTTPClient#get function
    apiOptions?: HTTPOptions;

    // processError processes error response
    //processError?: (err: any) => void
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


// HTTPOptions is just a type safe way of applying api options
// to HTTPClient#get parameter
export interface HTTPOptions {
    body?: any;
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

// TableCaptionExportConfig is config used in any table caption
// to determine settings for exporting current data
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

// BaseTableActionConfig is base config used for any table actions
export interface BaseTableActionConfig {
    // actionFn takes in BaseTableComponent and manipulates the
    // table based on passed function
    actionFn: (componentRef: any) => void;
}

// ------------------ TABLE INTERFACES -----------------------

// BaseTableEvent should be the interface that is emitted from every event
// that occurs in table
export interface BaseTableEvent {
    // eventFieldName is to describe what type of event has occured
    // This is meant to give more meta data about event
    eventFieldName?: string;

    // event should be custom event type that can be used by event listeners
    event?: any;
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

    // exportConfig is config used to export current table info
    // to a file format specific to config
    exportConfig?: TableCaptionExportConfig;

    // createAction is custom function to be used whenever user
    // wants to create an entity
    createAction?: (any) => void;
}

interface baseConfig {
    // getState is the filter state of the table that will be sent to server
    // Setting this will set the table with initial state when making
    // first call to server
    getState?: (outerData: any) => State;

    // customSearch will override default search of mobile table to implement own
    // request to server
    customTableSearch?: (table: any) => void;

    // autosearch enables/disables ability for table to automatically update
    // whenever user changes any column filters without having to explicitly
    // hit a search button
    //
    // Default: true
    autoSearch?: boolean;

    // customTableSearch is for overriding the default search functionality built into the table itself
    // when searching for table settings of external datasource
    //
    // Default: undefined
    customTableSettingsSearch?(componentRef: any): void;

    // outerDataHeader is used for inner tables where outerData is the data passed
    // from the "above" table and can be used to display a header for the inner table
    // This is useful for a visual cue when you have several inner tables open, it can
    // get overwhelming on what table you are currently looking at
    outerDataHeader?: (outerData: any) => string;

    // tableAPICfg is config used to call api from server
    tableAPIConfig?: APIConfig;

    // paramCfg is config used to determine parameter names that will be sent to server
    paramConfig?: ParamConfig;

    // pagination determines pagination settings for table
    pagination?: BasePagination;

    // exportConfig is config to allow to export table info to different 
    // formats such as csv, excel, etc
    exportConfig?: ExportConfig;
}

// BaseMobileTableConfig is the main config used for mobile table
export interface BaseMobileTableConfig extends BaseEventOptionsI, baseConfig {
    // captionCfg is config used to generate dynamic caption component with settings
    caption?: MobileCaptionEntity;

    // displayItem is config used to generate dynamic component in mobile table row
    rowEntity?: DisplayItemEntity;

    // panelHeaderEvent is function that will be called whenever panel header of mobile is clicked
    // The event parameter can be used to determine what to do with event
    rowEvent?: (event: BaseTableEvent, componentRef: any) => void;

    // panelHeaderStyle is styling to be used for panel header of mobile stable
    getRowStyle?: (rowData: any) => Object;

    // panelHeaderClass is classes to be used for panel header of mobile stable
    getRowClass?: (rowData: any) => string;

    // rowExpansion is config used to expand an inner table with current mobile table
    rowExpansion?: Map<string, BaseComponentEntity>;
}

// BaseTableConfig is the main config that is used against our table api
export interface BaseTableConfig extends BaseEventOptionsI, baseConfig {
    // tableSettingsAPIConfig makes an api call based on given url and applies the results
    // to column filter values specified
    tableSettingsAPIConfig?: APIConfig;

    // columns is where we dynamically create columns with configuration
    columns?: CoreColumn[];

    // rowExpansion is ability to inject component into table expansion to
    // display related items of particular row
    rowExpansion?: BaseComponentEntity;

    // caption is ability to inject component into table caption header
    caption?: CaptionEntity;
}


// ------------------ COLUMN CONFIGURATION -----------------------

// 
// The below interfaces are essentially configuration settings that can
// be passed to various parts of a table and will NOT be directly implemented by classes
//

// ProcessRowDataI interface should be used for any component that can process row data
export interface ProcessRowDataI {
    // processRowData function allows user to process row data given to
    // current component with a reference to itself so based on rowData value
    // a user can update the component 
    processRowData?: (rowData: any, componentRef: any) => void;
}

// ConfigI interface should be apply to any component that has config
export interface ConfigI {
    // config is generic config for current component
    config?: any;
}

// BaseComponentI interface is repsonsible for giving value and process events
export interface BaseComponentI extends ConfigI {
    // componentRef should be reference to component that called current component
    componentRef?: any;

    // value is the value for current component
    value?: any;

    // processEvent is function that should process generic events
    processEvent?: (event: any, componentRef: any) => void;
}

// PopupFormI interface allows user to process various events that occur in popup form
export interface PopupFormI extends ConfigI {
    // processEvent is function that should process generic events from modal form
    processEvent?: (event: any, formRef: any) => void;

    // processError is function that should process error from modal form
    processError?: (err: any, formRef: any) => void;

    // processSuccess is function that should process success from modal form
    processSuccess?: (event: any, formRef: any) => void;

    // processClose is function that should process when modal form closes
    processClose?: (formRef: any) => void;

    // processLoadingComplete is function that should process when form is
    // complete initializing, usually when api calls are complete
    processLoadingComplete?: (formRef: any) => void;

    // processBeforeSubmit is function that should process form before submitting to server
    processBeforeSubmit?: (form: FormGroup, formRef: any) => Promise<boolean>;

    // successDismiss is marker using to indicate when modal is successfully dismissed
    successDismiss?: any;
}

// BaseMobileFilterI interface is settings for any mobile component that contains a form field
export interface BaseMobileFilterI extends BaseComponentI {
    // field is the name of the form field
    field?: string;

    // selectedValue is value user wants form field to be initialized with
    selectedValue?: any;

    // operator is filter operator for form field ie. 'eq', 'neq', 'contains' etc.
    operator?: string;
}

// BaseColumnFilterI interface is settings for any component that contains a form field
export interface BaseColumnFilterI extends BaseMobileFilterI, ProcessRowDataI, BaseEventOptionsI {
    // getSelectedValue is function that takes in rowData and returns selected value  based on rowData
    getSelectedValue?: (rowData: any) => any;

    // excludeFilter will exclude field from being sent to server if set
    excludeFilter?: boolean;
}

// BaseDisplayItemI interface is settings for any component that wants to display DOM element
export interface BaseDisplayItemI extends BaseComponentI, ProcessRowDataI, BaseEventOptionsI { }


// ---------------- TABLE CONFIGURATION ------------------

// IndexTableI interface should be implemented by all table types
export interface IndexTableI extends ConfigI {
    // state represents current filter state for table
    state?: State;
}

// ---------------- TABLE IMPLEMENTATION ------------------

// BaseIndexTableEntity is table entity
export interface BaseIndexTableEntity extends ConfigI {
    component: Type<IndexTableI>;
}

// PopupFormEntity is entity used for popup form
export interface PopupFormEntity extends PopupFormI {
    component: Type<BaseFormEventComponent>;
}

// CaptionEntity is used to display caption component in caption part of table
export interface CaptionEntity extends BaseComponentI, BaseEventOptionsI {
    component: Type<BaseTableCaptionComponent>;
}

// MobileCaptionEntity is used to display caption component for mobile table
export interface MobileCaptionEntity extends BaseComponentI, BaseEventOptionsI {
    component: Type<BaseEventComponent>;
}

export interface ConfigEntity extends ConfigI {
    component: Type<ConfigI>;
}

export interface BaseComponentEntity extends BaseComponentI {
    component: Type<BaseComponent>;
}

export interface BaseEventEntity extends BaseComponentI {
    component: Type<BaseEventComponent>;
}

// ---------------- COLUMN IMPLEMENTATION ------------------

export interface ColumnFilterEntity extends BaseColumnFilterI {
    component: Type<BaseColumnFilterComponent>;
}

export interface DisplayItemEntity extends BaseDisplayItemI {
    component: Type<BaseDisplayItemComponent>;
}


// ------------------ COLUMN CONFIGS -----------------------


// BaseEventOptionsI represents the base event options that every table should contain
export interface BaseEventOptionsI {
    // processCaptionEvent activates whenever an event occurs from the caption
    processCaptionEvent?: (event: BaseTableEvent, componentRef: any) => void;

    // processPopupEvent will process any event that occurs within a popup form/display
    processPopupEvent?: (event: BaseTableEvent, componentRef: any) => void;

    // processTableCellEvent processes an event from body cell for current column
    // This function will only activate if tableCell#field property is set 
    // to field that is exposed when a body cell creates an event which
    // should be based off the BaseTableEvent interface
    processTableCellEvent?: (event: BaseTableEvent, componentRef: any) => void;

    // processDisplayItemEvent process any event that a display item emits
    // This will usually be either a text link or button
    processDisplayItemEvent?: (event: BaseTableEvent, componentRef: any) => void;

    // processColumnFilterEvent processes an event from column filter for current column
    // There is no need to make explicit api request within this function as the table
    // api will do this for us
    //
    // The main purpose of this function is to be able to do various checks and
    // potentially modify BaseTableComponent#state variable before it is sent to 
    // server by table api
    processColumnFilterEvent?: (event: BaseTableEvent, componentRef: any) => void;

    // processSortEvent is activated whenever a column is sorted
    processSortEvent?: (event: BaseTableEvent, componentRef: any) => void;

    // processTableFilterEvent activates whenever the table changes data through
    // a column filter change, pagination etc.
    processTableFilterEvent?: (event: BaseTableEvent, componentRef: any) => void;

    processTableFilterErrorEvent?: (event: BaseTableEvent, componentRef: any) => void;

    processTableSettingsFilterEvent?: (event: BaseTableEvent, componentRef: any) => void;

    processTableSettingsFilterErrorEvent?: (event: BaseTableEvent, componentRef: any) => void;

    // processClearFiltersEvent activates whenever the "Clear Filters" button is used by user
    processClearFiltersEvent?: (event: BaseTableEvent, componentRef: any) => void;

    processInputTemplateEvent?: (event: BaseTableEvent, componentRef: any) => void;
}

// TemplateConfig is config used for cell/row editing and determines
// what the input and output template/component will be
export interface TemplateConfig {
    // inputTemplate is used to determine what input template will be
    // used for editing values
    inputTemplate: ColumnFilterEntity;

    // outputTemplate is used to determine what output template will be
    // used when displaying info
    outputTemplate: ColumnFilterEntity;
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

// MobileTableRowEvent is event config that should be triggered whenever
// any type of event occurs to row of mobile table
export interface MobileTableRowEvent {
    // actionEvent is event that occurs when an action is triggered on row
    // mobile table and is up to user to implement what actions to trigger
    // ie. mouse click, hover, etc
    actionEvent: any;

    // rowData is the data for current mobile row
    rowData: any;
}

export interface CoreColumn {
    // field represents json name of field
    // WE NEED FIELD FOR ABILITY TO EXPORT COLUMN, DO NOT DELETE
    field: string;

    // header represents display name of field
    header?: string;

    // hideColumn will hide column if set true
    hideColumn?: boolean;

    // hideColumnFilter will hide the filter for current column
    hideColumnFilter?: boolean;

    // showColumnOption will determine whether to show column in
    // drop down options within caption
    showColumnOption?: boolean;

    // headerStyle styles header of column if set
    headerStyle?: Object;

    // headerClass will set CSS class for column header if set
    headerClass?: string;

    // headerStyle styles header of column if set
    columnFilterStyle?: Object;

    // headerClass will set CSS class for column header if set
    columnFilterClass?: string;

    // columnFilter will display column filter and pass along config settings
    // to component if set
    columnFilter?: ColumnFilterEntity;

    // sort allows us to activate the ability to sort on current column
    sort?: SortOperation;

    // tableCellStyle will set style for cell of column if set
    getTableCellStyle?: (rowData: any) => Object;

    // tableCellClass will set CSS class for column cell if set
    getTableCellClass?: (rowData: any) => string;

    // // tableCellStyle will set style for cell of column if set
    // tableCellStyle?: Object

    // // tableCellClass will set CSS class for column cell if set
    // tableCellClass?: string;

    // tableCell will display component within cell of table of current column
    // and pass config if set
    tableCell?: ColumnFilterEntity;

    // displayItemStyle will set style for cell of column if set
    getDisplayItemStyle?: (rowData: any) => Object;

    // displayItemClass will set CSS class for column cell if set
    getDisplayItemClass?: (rowData: any) => string;

    // // displayItemStyle will set style for cell of column if set
    // displayItemStyle?: Object

    // // displayItemClass will set CSS class for column cell if set
    // displayItemClass?: string;

    // displayItem will display dynamically generated component within table cell
    //
    // displayItem is a "subset" of tableCell property, as in, the intention is to
    // display something like text or a button instead of a form field
    displayItem?: DisplayItemEntity;

    // textStyle is style to be applied to text cell
    getTextStyle?: (rowData: any) => Object;

    // textClass is class to be applied to text cell
    getTextClass?: (rowData: any) => string;

    // // textStyle is style to be applied to text cell
    // textStyle?: Object;

    // // textClass is class to be applied to text cell
    // textClass?: string;

    // text takes in row value for that column and should return html based on value if set
    text?: (any) => string;
}

export interface FilterConfig {
    // type determines the icon that will be displayed
    type: 'textInput' | 'date',

    // options determines what list of values will be displayed for filter
    // along with ability to select default value
    options: FilterOptions;
}

// FilterOptions displays filter options and ability to choose default option
export interface FilterOptions {
    // values is list of values to display
    values: SelectItem[];

    // selectValue is default value selected 
    selectedValue: any
}

export interface CheckboxEvent {
    field?: string;
    colIdx?: number;
    rowIdx?: number;
    rowData?: any;
    checked?: boolean;
    isHeaderCheckbox?: boolean;
}

// MaskConfig is config used for input fields to manipulate what characters 
// can be entered into field
//
// This config is used in conjunction with ngx-mask library
export interface MaskConfig extends IConfig {
    // maskTemplate is template used to format output of input field
    maskTemplate: string;
}

// BasePagination is base pagination settings for any table to extend
export interface BasePagination {
    // pageSize is number of entries to retrieve from datasource
    pageSize?: number;

    // pageSizeOptions is array of numbers that allows user to change
    // the number of entries per page
    pageSizeOptions?: number[];
}

// DisplayFormat is config used style a display item
export interface DisplayFormat {
    // item is element that should be displayed
    item: string;

    // borderClass should be css class surrounding item
    borderClass?: string;

    // borderStyle should be object style surrounding item
    borderStyle?: Object;
}

// --------------------- TAB VIEW ----------------------

// TabViewConfig is config used for row expansion having inner tabs
export interface TabViewConfig {
    // selectedIdx is the tab panel that should be opened when tab view is first created
    selectedIdx: number;

    // config is config for tab view
    tabViewConfig?: any;

    // panels is config settings for each tab panel in tab view
    panels: TabPanelItem[];
}

// TabPanelItem is config used for each tab within a collection of tab views
export interface TabPanelItem {
    // tabPanelConfig is general config for tabview
    tabPanelConfig?: any;

    // header will display text for panel header with optional styling
    // This will override headerEntity
    header?: DisplayFormat;

    // headerComponent will be dynamically generated component for panel header
    headerEntity?: ConfigEntity;

    // panelEntity is the component that will be the generated within tab panel
    // This will override contentHTML
    panelEntity?: BaseComponentEntity;
}