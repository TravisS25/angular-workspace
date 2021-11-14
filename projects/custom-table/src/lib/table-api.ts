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
    processResult?: (result: any, componentRef?: any) => any;

    // apiOptions is the options to set for HTTPClient#get function
    apiOptions?: HTTPOptions;

    // processError processes error response
    processError?: (err: any) => void
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

// BaseTableActionConfig is base config used for any table actions
export interface BaseTableActionConfig {
    // actionFn takes in BaseTableComponent and manipulates the
    // table based on passed function
    actionFn: (componentRef: any) => void;
}

// ------------------ TABLE INTERFACES -----------------------

// BaseTableEventConfig is config that should be extended by all component's configs
// that emit an event
export interface BaseTableEventConfig {
    // eventType should be unique name of event that is triggered by table component
    eventType?: any;
}

// BaseTableEvent should be the interface that is emitted from every event
// that occurs in table
//
// The eventType that is extended from BaseTableEventConfig can be used
// as identifier of what kind of event has been emitted and use that to
// cast our "event" property to appropriate type
export interface BaseTableEvent extends BaseTableEventConfig {
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

    // exportCfg is config used to export current table info
    // to a file format specific to config
    exportCfg?: TableCaptionExportConfig;

    // createAction is custom function to be used whenever table
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
    displayItem?: DisplayItemEntity;

    // panelHeaderEvent is function that will be called whenever panel header of mobile is clicked
    // The event parameter can be used to determine what to do with event
    rowEvent?: (event: any, rowData: any, componentRef: any) => void;

    // panelHeaderStyle is styling to be used for panel header of mobile stable
    rowStyle?: Object;

    // panelHeaderClass is classes to be used for panel header of mobile stable
    rowClass?: string;

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

export interface ProcessRowDataI {
    processRowData?: (rowData: any, componentRef: any) => void;
}

export interface ConfigI {
    config?: any;
}

export interface BaseComponentI extends ConfigI {
    componentRef?: any;
    value?: any;
}

export interface PopupFormI extends ConfigI {
    onSuccess?: EventEmitter<any>;
    onClose?: EventEmitter<any>;
    successDismiss?: any;
}

export interface BaseMobileFilterI extends BaseComponentI {
    field?: string;
    selectedValue?: any;
    operator?: string;
}

export interface BaseColumnFilterI extends BaseMobileFilterI, ProcessRowDataI, BaseEventOptionsI {
    getSelectedValue?: (rowData: any) => any;
    excludeFilter?: boolean;
}

export interface BaseDisplayItemI extends BaseComponentI, ProcessRowDataI, BaseEventOptionsI { }


export interface BaseMobileRowExpansionI extends BaseComponentI {
    //rowExpansionMap: Map<string,>
}


// ---------------- TABLE CONFIGURATION ------------------

export interface IndexTableI extends ConfigI {
    state?: State;
}

// ---------------- TABLE IMPLEMENTATION ------------------

export interface BaseIndexTableEntity extends IndexTableI {
    component: Type<IndexTableI>;
}

export interface PopupFormEntity extends PopupFormI {
    component: Type<PopupFormI>;
}

// CaptionEntity is used to display caption component in caption part of table
export interface CaptionEntity extends BaseComponentI, BaseEventOptionsI {
    component: Type<BaseTableCaptionComponent>;
}

export interface MobileCaptionEntity extends BaseComponentI, BaseEventOptionsI {
    component: Type<BaseEventComponent>;
}


// ---------------- COLUMN IMPLEMENTATION ------------------

export interface ConfigEntity extends ConfigI {
    component: Type<ConfigI>;
}

export interface BaseComponentEntity extends BaseComponentI {
    component: Type<BaseComponent>;
}

export interface BaseEventEntity extends BaseComponentI {
    component: Type<BaseEventComponent>;
}

/////// Table /////////

// // RowExpansionEntity is used to display expansion component of table
// export interface RowExpansionEntity extends BaseComponentI {
//     // component is component to use for expansion of table
//     component: Type<BaseComponent>;
// }

export interface ColumnFilterEntity extends BaseColumnFilterI {
    component: Type<BaseColumnFilterComponent>;
}

export interface DisplayItemEntity extends BaseDisplayItemI {
    component: Type<BaseDisplayItemComponent>;
}

/////// Mobile /////////

// export interface MobileRowExpansionEntity extends BaseMobileRowExpansionI {
//     component: Type<BaseComponent>;
// }


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

    // processClearFiltersEvent activates whenever the "Clear Filters" button
    // is used by user
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

    // tableCellStyle will set style for cell of column if set
    tableCellStyle?: Object;

    // tableCellClass will set CSS class for column cell if set
    tableCellClass?: string;

    // tableCell will display component within cell of table of current column
    // and pass config if set
    tableCell?: ColumnFilterEntity;

    // displayItemStyle will set style for cell of column if set
    displayItemStyle?: Object;

    // displayItemClass will set CSS class for column cell if set
    displayItemClass?: string;

    // displayItem will display dynamically generated component within table cell
    //
    // displayItem is a "subset" of tableCell property, as in, the intention is to
    // display something like text or a button instead of a form field
    displayItem?: DisplayItemEntity;

    // sort allows us to activate the ability to sort on current column
    sort?: SortOperation;

    // tableCellHTML takes in row value for that column and should
    // return html based on value if set
    // If neither tableCell or tableCellHTML is set, then the
    // row data will be displayed if "field" is set
    tableCellHTML?: (any) => string;
}

// Column is the base settings interface that is used with base table component
// All settings that deal with columns should be set with this
export interface Column {
    // field represents json name of field
    // WE NEED FIELD FOR ABILITY TO EXPORT COLUMN, DO NOT DELETE
    field: string;

    // header represents display name of field
    header?: string;

    // renderColumnContent can be used to determine if the content in the table
    // cell is even rendered, NOT just hidden
    // This is used in conjunction with BaseTableAPI#showNoRecordsLabel and set by table api
    // but can be set manually if one wishes to not render cell content based on some condition
    //
    // Default: true
    renderColumnContent?: boolean;

    // hideColumn will hide column if set true
    hideColumn?: boolean;

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
    columnFilterStyle?: Object;

    // headerClass will set CSS class for column header if set
    columnFilterClass?: string;

    // columnFilter will display column filter and pass along config settings
    // to component if set
    columnFilter?: ColumnFilterEntity;

    // tableCellStyle will set style for cell of column if set
    tableCellStyle?: Object;

    // tableCellClass will set CSS class for column cell if set
    tableCellClass?: string;

    // displayItem will dynamically generate component that will display
    // text or html element 
    displayItem?: DisplayItemEntity;

    // tableCell will display component within cell of table of current column
    // and pass config if set
    tableCell?: ColumnFilterEntity;

    // sort allows us to activate the ability to sort on current column
    sort?: SortOperation;

    // templateConfig is config used to set up inline edting for table
    // by configuring an input and output template
    templateConfig?: TemplateConfig;

    // tableCellHTML takes in row value for that column and should
    // return html based on value if set
    // If neither tableCell, displayItem or tableCellHTML is set, then the
    // row data will be displayed if "field" is set
    // tableCellHTML?: (any) => string;
}


export interface FilterConfig {
    // type determines the icon that will be displayed
    type: 'textInput' | 'date',

    // options determines what list of values will be displayed for filter
    // along with ability to select default value
    options: FilterOptions;
}

// FilterOptions display filter options and ability to choose default option
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

export interface MaskConfig extends IConfig {
    maskTemplate: string;
}

// BasePagination is base pangination settings for any table to extend
export interface BasePagination {
    pageSize?: number;
    pageSizeOptions?: number[];
}


// DisplayFormat is config used style a display item
export interface DisplayFormat {
    item: string;
    borderClass?: string;
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
    tabPanelConfig?: any;

    // headerComponent will be dynamically generated component for panel header
    headerEntity?: ConfigEntity;

    // panelEntity is the component that will be the generated within tab panel
    // This will override contentHTML
    panelEntity?: BaseComponentEntity;
}