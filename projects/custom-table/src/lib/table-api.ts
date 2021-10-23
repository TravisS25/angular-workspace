import { Type, EventEmitter, SimpleChanges, OnInit, OnDestroy, Component, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { Table } from 'primeng/table/table'
import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { MessageService, Message, MenuItem } from 'primeng/api';
import { IConfig } from 'ngx-mask';
import { BaseTableCaptionComponent } from './components/table/base-table-caption/base-table-caption.component';
import { BaseColumnComponent } from './components/table/base-column/base-column.component';
import { BaseDisplayItemComponent } from './components/table/base-display-item/base-display-item.component';
import { BaseMobileFilterComponent } from './components/table/mobile/base-mobile-filter/base-mobile-filter.component';
import { BaseRowExpansionComponent } from './components/table/base-row-expansion/base-row-expansion.component';
import { BaseMobileTableComponent } from './components/table/mobile/base-mobile-table/base-mobile-table.component';
import { BaseMobileDisplayItemComponent } from './components/table/mobile/base-mobile-display-item/base-mobile-display-item.component';
import { BaseMobileTableEventComponent } from './components/table/mobile/base-mobile-table-event/base-mobile-table-event.component';

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
    bodyCell,
    closeRows,
    export,
    summary,
}

export enum ActionEvents {
    mouseEnter = 1,
    mouseLeave,
    click
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
// for the TableConfig#exportConfig property setting
//
// The "command" function of MenuItem is overwritten when used in 
// TableConfig#exportConfig property setting to handle the appropriate
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

// ExportConfig is config used in TableConfig to construct
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

    // modal is function used to create a modal for creating
    // entry for table
    //
    // The passed parameter will be current table initiating modal
    modal?: (component: any) => void;

    // pageURL is function used to take in rowData/outerData and 
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
    processOnClose?: (result: any, componentRef: any) => void
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

    // exportCfg is config used to export current table info
    // to a file format specific to config
    exportCfg?: TableCaptionExportConfig;

    // createCfg is config used to create entry for table either
    createCfg?: BaseActionConfig;
}

// MobileTableConfig is the main config used for mobile table
export interface MobileTableConfig extends MobileTableEventOptions, TableStateChangeI {
    // captionCfg is config used to generate dynamic caption component with settings
    captionCfg?: MobileCaptionEntity;

    // panelTitleCfg is config used generate dynamic component for mobile table with settings
    panelTitleCfg?: MobileDisplayItemEntity;

    // panelDescriptionCfg is config used generate dynamic component for mobile table with settings
    panelDescriptionCfg?: MobileDisplayItemEntity;

    // tableAPICfg is config used to call api from server
    tableAPICfg?: APIConfig;

    // panelHeaderEvent is function that will be called whenever panel header of mobile is clicked
    // The event parameter can be used to determine what to do with event
    panelHeaderEvent?: (event: any, rowData: any, table: any) => void;

    // outerDataHeader takes in outerData and returns header for page
    outerDataHeader?: (outerData: any) => string;

    // processEvent will process any event made from mobile table
    //processEvent?: (event: BaseTableEvent, table: any) => void;

    // getState is the filter state of the table that will be sent to server
    // Setting this will set the table with initial state when making
    // first call to server
    getState?: (outerData: any) => State;

    // customSearch will override default search of mobile table to implement own
    // request to server
    customSearch?: (table: any) => void;

    // pagination is config used to determine table's page settings such as rows per page
    pagination?: MaterialPagination;

    // panelHeaderStyle is styling to be used for panel header of mobile stable
    panelHeaderStyle?: Object;

    // panelHeaderClass is classes to be used for panel header of mobile stable
    panelHeaderClass?: string;

    // expansion is config used to expand an inner table with current mobile table
    expansion?: MobileRowExpansionEntity;

    // paramCfg is config used to determine parameter names that will be sent to server
    paramCfg?: ParamConfig;
}


// TableConfig is the main config that is used against our table api
export interface TableConfig extends TableEventOptions, TableStateChangeI {
    // getState is the filter state of the table that will be sent to server
    // Setting this will set the table with initial state when making
    // first call to server
    getState?: (outerData: any) => State;

    // summary is config used to generate custom summary component
    // summary?: SummaryEntity;

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
    rowExpansion?: RowExpansionEntity;

    // caption is ability to inject component into table caption header
    caption?: CaptionEntity;

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
    onEditInit?: (event: EditEvent, componentRef: any) => void;

    // Callback to invoke when cell edit is completed
    //
    // Default: Empty function
    onEditComplete?: (event: EditEvent, componentRef: any) => void;

    // Callback to invoke when cell edit is cancelled with escape key
    //
    // Default: Empty function
    onEditCancel?: (event: EditEvent, componentRef: any) => void;

    // customTableSearch is for overriding the default search functionality built into the table itself
    // when searching for entries of external datasource
    //
    // Default: undefined
    customTableSearch?(componentRef: any): void;

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
}

// ------------------ COLUMN CONFIGURATION -----------------------

export interface ConfigI {
    config?: any;
}

export interface PopupFormI extends ConfigI {
    onSuccess?: EventEmitter<any>;
    onClose?: EventEmitter<any>;
}

export interface BaseDisplayItemI extends ConfigI {
    value?: any;
    processRowData?: (rowData: any) => any;
}

export interface BaseMobileFilterI extends ConfigI {
    field?: string;
    value?: any;
    selectedValue?: any;
    operator?: string;
}

export interface BaseColumnI extends BaseMobileFilterI {
    getSelectedValue?: (rowData: any) => any;
    processRowData?: (rowData: any) => any;
    excludeFilter?: boolean;
}

export interface BaseMobileRowExpansionI extends ConfigI {
    expansionMap: Map<string, MobileRowExpansionEntity>;
    borderStyle?: Object;
    borderClass?: string;
}

export interface BaseRowExpansionI {
    config?: any;
    renderCallback?: EventEmitter<any>
    outerData?: any;
}

// ---------------- TABLE CONFIGURATION ------------------

// TableSwitchI is interface used in util component BaseIndexComponent
// that allows user to switch between mobile and desktop tables
export interface TableSwitchI {
    state: State;
    config: TableStateChangeI;
}

//
// NOTE MAY CHANGE THIS AFTER REFACTOR!!!
//
// TableStateChangeI is interface used to make sure any table component
// injected into BaseIndexComponent has ability to take 
export interface TableStateChangeI {
    getTableStateChange?: (any) => State;
}

// ---------------- TABLE IMPLEMENTATION ------------------

export interface BaseIndexTableEntity {
    component: Type<TableSwitchI>;
    config: TableStateChangeI;
}

export interface PopupFormEntity extends PopupFormI {
    component: Type<PopupFormI>;
    successDismiss?: any;
}

export interface PopupDisplayEntity extends ConfigI {
    component: Type<ConfigI>;
}

// CaptionEntity is used to display caption component in caption part of table
export interface CaptionEntity extends ConfigI {
    component: Type<BaseTableCaptionComponent>;
}

export interface MobileCaptionEntity extends ConfigI {
    component: Type<BaseMobileTableEventComponent>;
}


// ---------------- COLUMN IMPLEMENTATION ------------------

/////// Table /////////

// RowExpansionEntity is used to display expansion component of table
export interface RowExpansionEntity extends BaseRowExpansionI {
    // component is component to use for expansion of table
    component: Type<BaseRowExpansionComponent>;
}

export interface ColumnEntity extends BaseColumnI, TableEventOptions {
    component: Type<BaseColumnComponent>;
}

export interface DisplayItemEntity extends BaseDisplayItemI, TableEventOptions {
    component: Type<BaseDisplayItemComponent>;
}

/////// Mobile /////////

export interface MobileFilterEntity extends BaseMobileFilterI, MobileTableEventOptions {
    component: Type<BaseMobileFilterComponent>;
}

export interface MobileRowExpansionEntity extends BaseMobileRowExpansionI, MobileTableEventOptions {
    component: Type<BaseMobileTableComponent>;
}

export interface MobileDisplayItemEntity extends BaseDisplayItemI, TableEventOptions {
    component: Type<BaseMobileDisplayItemComponent>;
}

// ------------------ COLUMN CONFIGS -----------------------


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

// BaseEventOptions represents the base event options that every table should contain
export interface BaseEventOptions {
    // processCaptionEvent activates whenever an event is broadcast from the caption
    processCaptionEvent?: (event: any, componentRef: any) => void;

    // processOuterEvent is activated whenever an event outside of the table
    // occurs but we may want to process it and modify something within the table
    processOuterEvent?: (event: any, componentRef: any) => void;
}

// TableEventOptions is config that can be optionally be added to a config passed
// to different parts of table api such as caption, column filter, etc.
//
// The purpose of TableEventOptions is to be able to listen to events on a per 
// column basis and should be used within the Column config
export interface TableEventOptions extends BaseEventOptions {
    // processBodyCellEvent processes an event from body cell for current column
    // This function will only activate if bodyCell#field property is set 
    // to field that is exposed when a body cell creates an event which
    // should be based off the BaseTableEvent interface
    processBodyCellEvent?: (event: any, componentRef: any) => void;

    // processColumnFilterEvent processes an event from column filter for current column
    // There is no need to make explicit api request within this function as the table
    // api will do this for us
    //
    // The main purpose of this function is to be able to do various checks and
    // potentially modify BaseTableComponent#state variable before it is sent to 
    // server by table api
    processColumnFilterEvent?: (event: any, componentRef: any) => void;

    // processSortEvent is activated whenever a column is sorted
    processSortEvent?: (event: any, componentRef: any) => void;

    // processTableFilterEvent activates whenever the table changes data through
    // a column filter change, pagination etc.
    processTableFilterEvent?: (event: any, componentRef: any) => void;

    // processClearFiltersEvent activates whenever the "Clear Filters" button
    // is used by user
    processClearFiltersEvent?: (event: any, componentRef: any) => void;
}

export interface MobileTableEventOptions extends BaseEventOptions {
    // processPanelTitleEvent will process events that happen within the title 
    // section of a mobile table
    processPanelTitleEvent?: (event: any, componentRef: any) => void;

    // processPanelDescriptionEvent will process events that happen within the
    // description section of a mobile table
    processPanelDescriptionEvent?: (event: any, componentRef: any) => void;
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

export interface BaseColumn {
    // field represents json name of field
    // WE NEED FIELD FOR ABILITY TO EXPORT COLUMN, DO NOT DELETE
    field: string;

    // header represents display name of field
    header?: string;

    // hideColumn will hide column if set true
    hideColumn?: boolean;

    // showColumnOption will show current column
    // in the dropdown list in caption
    //
    // Default: true
    showColumnOption?: boolean;

    // hideColumnFilter will hide the filter for current column
    hideColumnFilter?: boolean;

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
    columnFilter?: ColumnEntity;

    // bodyCellStyle will set style for cell of column if set
    bodyCellStyle?: Object;

    // bodyCellClass will set CSS class for column cell if set
    bodyCellClass?: string;

    // bodyCell will display component within cell of table of current column
    // and pass config if set
    bodyCell?: ColumnEntity;

    // sort allows us to activate the ability to sort on current column
    sort?: SortOperation;

    // bodyCellHTML takes in row value for that column and should
    // return html based on value if set
    // If neither bodyCell or bodyCellHTML is set, then the
    // row data will be displayed if "field" is set
    bodyCellHTML?: (any) => string;
}

export interface PrimengColumn extends BaseColumn {
    // renderColumnContent can be used to determine if the content in the table
    // cell is even rendered, NOT just hidden
    // This is used in conjunction with BaseTableAPI#showNoRecordsLabel and set by table api
    // but can be set manually if one wishes to not render cell content based on some condition
    //
    // Default: true
    renderColumnContent?: boolean;

    // colStyle will style col group if set.  This style should
    // really only be used to set width of column
    colStyle?: Object;

    // templateConfig is config used to set up inline edting for table
    // by configuring an input and output template
    templateConfig?: TemplateConfig;
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
    columnFilter?: ColumnEntity;

    // bodyCellStyle will set style for cell of column if set
    bodyCellStyle?: Object;

    // bodyCellClass will set CSS class for column cell if set
    bodyCellClass?: string;

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

export interface MaterialPagination {
    pageSize?: number;
    pageSizeOptions?: number[];
}

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
    contentComponent?: Type<BaseRowExpansionI>;

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