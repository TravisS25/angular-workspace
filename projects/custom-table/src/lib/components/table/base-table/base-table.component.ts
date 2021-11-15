import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { BaseTableEvent, State, CoreColumn, ExportType, FilterData, FilterDescriptor, BaseTableConfig, ColumnFilterEntity, DisplayItemEntity, BaseEventOptionsI } from '../../../table-api';
import { Subscription } from 'rxjs';
import { BaseComponent } from '../../base/base.component';
import { BaseColumnFilterComponent } from '../../table/base-column-filter/base-column-filter.component'
import { getDefaultState } from '../../../default-values'
import { TableCaptionDirective } from '../../../directives/table/table-caption.directive';
import { TableBodyCellDirective } from '../../../directives/table/table-body-cell.directive';
import { TableColumnFilterDirective } from '../../../directives/table/table-column-filter.directive';
import { HttpService } from '../../../services/http.service';
import { encodeURIState } from '../../../util'
import { setTableEvents } from '../../table/table-util';
import { BaseTableCaptionComponent } from '../../table/base-table-caption/base-table-caption.component'
import { BaseTableCellDirective } from '../../../directives/table/base-table-cell.directive'
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { TableRowExpansionDirective } from '../../../directives/table/table-row-expansion.directive';
import { BaseDisplayItemComponent } from '../../../components/table/base-display-item/base-display-item.component';
import { TableDisplayItemDirective } from '../../../directives/table/table-display-item.directive';
import { TableEvents } from '../../../table-api';
import 'rxjs/add/observable/combineLatest';


@Component({
    selector: 'lib-base-table',
    templateUrl: './base-table.component.html',
    styleUrls: ['./base-table.component.scss']
})
export abstract class BaseTableComponent extends BaseComponent implements OnInit, AfterViewInit {
    // _hiddenColumnFilters is used to keep track of all initial hidden column filters
    // set in the column api when table is first loaded so whenever a user clicks the 
    // "Clear Filter" button, we can reset to the same initial state 
    protected _hiddenColumnFilters: string[] = [];

    // _hiddenColumns keeps track of all current hidden columns
    // This is mainly used to help set the value of the "visibleColumns" variable as in:
    // "this.visibleColumns = this.columnCheckboxes.length - this._hiddenColumns.length;"
    protected _hiddenColumns: string[] = [];

    // _updateTableCellComponents is used as a "hack flag" for table cell directives as
    // change events occur with any little change so this is set on initial load
    // and any events after that will not be effected
    protected _updateTableCellComponents: boolean = false;

    protected _updateDisplayItemComponents: boolean = false;

    // _updateColumnFilter is used as a "hack flag" as subscribing to the column filter
    // events triggers when retrieving new data
    // This variable will be set to false once we get initial data and will never need
    // to be updated again
    protected _updateColumnFilter: boolean = true;

    // _expansionLen is a "hack variable" for the expansion of a table
    // It keeps track of total number of expanded rows and helps with dynamically
    // creating row expansions
    protected _expansionLen: number = 0;

    // _tableInit is flag used to keep track if the current table has be fully initialized or not
    // This will be set true once the table is fully rendered and won't change again
    // There are various variables that depend on this to function
    protected _tableInit: boolean = false;

    // _bodyCellSubs is used to keep reference to explicitly body cell subscriptions
    // and will properly unsubscribe from them when new data is loaded into table
    protected _tableCellSub: Subscription = new Subscription();

    protected _displayItemSub: Subscription = new Subscription();

    // onTableFilterEvent is used by other components of the table like caption,
    // column filter and body cell rows and will be emitted by table whenever
    // new data is loaded into the table via column filter or pagination
    @Output() public onTableFilterEvent: EventEmitter<BaseTableEvent> = new EventEmitter<any>();

    // onClearFiltersEvent is used by other components of the table like caption,
    // column filter and body cell rows and will be emitted by table whenever
    // the "Clear Filter Button" is triggered
    @Output() public onClearFiltersEvent: EventEmitter<BaseTableEvent> = new EventEmitter<any>();

    // onSortEvent is triggered whenever a sort event occurs on a column
    @Output() public onSortEvent: EventEmitter<BaseTableEvent> = new EventEmitter<any>();

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

    @ViewChild(TableCaptionDirective, { static: false })
    public headerCaptionDir: TableCaptionDirective;
    @ViewChildren(TableRowExpansionDirective)
    public rowExpansionDirs: QueryList<TableRowExpansionDirective>;
    @ViewChildren(TableDisplayItemDirective)
    public displayItemDirs: QueryList<TableDisplayItemDirective>;
    @ViewChildren(TableBodyCellDirective)
    public tableCellDirs: QueryList<TableBodyCellDirective>;
    @ViewChildren(TableColumnFilterDirective)
    public columnFilterDirs: QueryList<TableColumnFilterDirective>;

    // captionCr keeps a reference to dynamically created caption component which can be 
    // modified through different events and will be destroyed on component destruction
    public captionCr: ComponentRef<BaseTableCaptionComponent>;

    // columnFilterCrs keeps a list of references to dynamically created column filters
    // components which can be modified through different events and will be destroyed on 
    // component destruction
    public columnFilterCrs: ComponentRef<BaseColumnFilterComponent>[] = [];

    // rowExpansionCrs keeps a list of references to dynamically created expanded row
    // components which can be modified through different events and will be destroyed on 
    // component destruction
    public rowExpansionCrs: ComponentRef<BaseComponent>[] = [];

    // tableCellCrs keeps a list of references to dynamically created body cell 
    // which can be modified through different events and will be destroyed on 
    // component destruction
    public tableCellCrs: ComponentRef<BaseColumnFilterComponent>[] = [];

    public displayItemCrs: ComponentRef<BaseDisplayItemComponent>[] = [];

    // visibleColumns keeps track of the total number of visible columns
    // This is needed for when we use row expansion, the UI needs to know how
    // many columns are in the "above" table in order to render correctly
    public visibleColumns: number = 0;

    // state keeps track of the current table's filter state and is the info that is 
    // sent to the server whenever a column filter is used or pagination occurs
    public state: State;

    // columns represents the columns of table and various config for each column
    // including column filter, body cell etc.
    public columns: CoreColumn[];

    // filterData represents the data that will be retrieved from server which is 
    // an array of objects and the total number of records based on current filter
    public filterData: FilterData

    constructor(
        public cdr: ChangeDetectorRef,
        public cfr: ComponentFactoryResolver,
        public http: HttpService,
    ) { super() }

    public ngOnInit(): void {

    }

    public ngAfterViewInit() {
        this.initAfterView();
    }

    public abstract onPageChange(event: any);
    public abstract onSortChange(event: any);
    public abstract closeRows();

    ///////////////////////////////////////////
    // INIT COLUMN COMPONENTS
    ///////////////////////////////////////////

    // createTableCellComponentRef creates and return a component reference based on the directive
    // and ComponentRef passed
    protected createTableCellComponentRef(dir: BaseTableCellDirective, ce: ColumnFilterEntity): ComponentRef<BaseColumnFilterComponent> {
        const cr = dir.viewContainerRef.createComponent(this.cfr.resolveComponentFactory(ce.component));
        cr.instance.componentRef = this;
        cr.instance.colIdx = dir.colIdx;
        cr.instance.rowIdx = dir.rowIdx;
        cr.instance.rowData = dir.rowData;
        cr.instance.isColumnFilter = false;
        cr.instance.isInputTemplate = false;
        cr.instance.config = ce.config;
        cr.instance.field = ce.field;
        cr.instance.value = ce.value;
        cr.instance.operator = ce.operator;
        cr.instance.processRowData = ce.processRowData;

        if (ce.getSelectedValue != undefined) {
            cr.instance.selectedValue = ce.getSelectedValue(dir.rowData);
        } else {
            cr.instance.selectedValue = ce.selectedValue;
        }

        return cr;
    }

    protected createDisplayItemComponentRef(dir: BaseTableCellDirective, ce: DisplayItemEntity): ComponentRef<BaseDisplayItemComponent> {
        const cr = dir.viewContainerRef.createComponent(this.cfr.resolveComponentFactory(ce.component));
        cr.instance.componentRef = this;
        cr.instance.colIdx = dir.colIdx;
        cr.instance.rowIdx = dir.rowIdx;
        cr.instance.rowData = dir.rowData;
        cr.instance.config = ce.config;
        cr.instance.value = ce.value;
        cr.instance.processRowData = ce.processRowData;

        return cr;
    }

    // initExpansionComponents initializes row expansion component reference
    // and creates component if set by api
    protected initExpansionComponents() {
        this._sub.add(
            this.rowExpansionDirs.changes.subscribe(val => {
                //console.log("expansion dir");
                //console.log(val);

                if (val.last && this.config.rowExpansion && this._expansionLen < val.length) {
                    const e = val.last as TableRowExpansionDirective

                    const cr = e.viewContainerRef.createComponent(
                        this.cfr.resolveComponentFactory(
                            this.config.rowExpansion.component,
                        )
                    );
                    cr.instance.outerData = this.outerData;
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
    protected initColumnFilterComponents() {
        this._sub.add(
            this.columnFilterDirs.changes.subscribe(val => {
                if (this._updateColumnFilter) {
                    const results = val._results as TableColumnFilterDirective[];
                    results.forEach((item) => {
                        const cr = item.viewContainerRef.createComponent(
                            this.cfr.resolveComponentFactory(
                                this.columns[item.colIdx].columnFilter.component
                            )
                        );
                        cr.instance.componentRef = this;
                        cr.instance.colIdx = item.colIdx;
                        cr.instance.isColumnFilter = true;
                        cr.instance.isInputTemplate = false;

                        cr.instance.field = this.columns[item.colIdx].columnFilter.field;
                        cr.instance.value = this.columns[item.colIdx].columnFilter.value;
                        cr.instance.selectedValue = this.columns[item.colIdx].columnFilter.selectedValue;
                        cr.instance.config = this.columns[item.colIdx].columnFilter.config;
                        cr.instance.excludeFilter = this.columns[item.colIdx].columnFilter.excludeFilter;
                        cr.instance.operator = this.columns[item.colIdx].columnFilter.operator;

                        setTableEvents(cr.instance, this.columns[item.colIdx].columnFilter);
                        this.columnFilterCrs.push(cr);
                    });
                }

                this._updateColumnFilter = false;
            })
        )
    }

    protected initCellComponents() {
        //const columns: CoreColumn[] = this.columns;
        this._sub.add(
            this.tableCellDirs.changes.subscribe(val => {
                // console.log('change within body cell')
                // console.log(val)

                if (this._updateTableCellComponents) {
                    //console.log('body cell dirs')

                    // If table has already been initialized, destroy current component references
                    // and assign tableCellCrs to empty array;
                    if (this._tableInit) {
                        this.tableCellCrs.forEach(item => {
                            item.destroy();
                        })
                        this.tableCellCrs = [];
                    }

                    const results = val._results as TableBodyCellDirective[];
                    results.forEach(item => {
                        const ce = this.columns[item.colIdx].tableCell
                        const cr = this.createTableCellComponentRef(item, ce)
                        setTableEvents(cr.instance, ce);
                        this.tableCellCrs.push(cr);
                    });

                    // If table has already been initialized, unsubscribe from current
                    // body cell subscriptions and assign "_bodyCellSubs" to empty array
                    // and then initialize new body cell component references 
                    if (this._tableInit) {
                        this._tableCellSub.unsubscribe();
                        this.initTableCellCrEvents()
                    }

                    this.cdr.detectChanges();
                    this._updateTableCellComponents = false;
                }
            })
        )

        this._sub.add(
            this.displayItemDirs.changes.subscribe(val => {
                // console.log('change within body cell')
                // console.log(val)

                if (this._updateDisplayItemComponents) {
                    //console.log('body cell dirs')

                    // If table has already been initialized, destroy current component references
                    // and assign tableCellCrs to empty array;
                    if (this._tableInit) {
                        this.displayItemCrs.forEach(item => {
                            item.destroy();
                        })
                        this.displayItemCrs = [];
                    }

                    const results = val._results as TableDisplayItemDirective[];
                    results.forEach(item => {
                        const di = this.columns[item.colIdx].displayItem
                        const cr = this.createDisplayItemComponentRef(item, di)
                        setTableEvents(cr.instance, di);
                        this.displayItemCrs.push(cr);
                    });

                    // If table has already been initialized, unsubscribe from current
                    // body cell subscriptions and assign "_bodyCellSubs" to empty array
                    // and then initialize new body cell component references 
                    if (this._tableInit) {
                        this._displayItemSub.unsubscribe();
                        this.initDisplayItemCrEvents();
                    }

                    this.cdr.detectChanges();
                    this._updateDisplayItemComponents = false;
                }
            })
        )
    }

    // initCaptionComponent initializes and creates caption component if set by config
    protected initCaptionComponent() {
        if (this.config.caption != undefined && this.config.caption != null) {
            const cr = this.headerCaptionDir.viewContainerRef.createComponent(
                this.cfr.resolveComponentFactory(
                    this.config.caption.component,
                )
            );
            cr.instance.config = this.config.caption.config;
            cr.instance.componentRef = this;
            cr.instance.outerData = this.outerData;
            setTableEvents(cr.instance, this.config.caption)
            this.captionCr = cr;
        }
    }

    // initCRSEvents is in charge of taking all of the initialized components
    // references and subscribing them all to each other's events and having
    // ability for all parts of the table to listen to each other 
    protected initCRSEvents() {
        // subscribing all components to table filter event, which occurs
        // whenever new data is written to table via column filter,
        // pagination, etc.
        this._sub.add(
            this.onTableFilterEvent.subscribe(r => {
                for (let i = 0; i < this.columnFilterCrs.length; i++) {
                    if (this.columnFilterCrs[i].instance.processTableFilterEvent != undefined) {
                        this.columnFilterCrs[i].instance.processTableFilterEvent(r, this);
                    }
                }
                for (let i = 0; i < this.tableCellCrs.length; i++) {
                    if (this.tableCellCrs[i].instance.processTableFilterEvent != undefined) {
                        this.tableCellCrs[i].instance.processTableFilterEvent(r, this);
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
        this._sub.add(
            this.onClearFiltersEvent.subscribe(r => {
                for (let i = 0; i < this.columnFilterCrs.length; i++) {
                    if (this.columnFilterCrs[i].instance.processClearFiltersEvent != undefined) {
                        this.columnFilterCrs[i].instance.processClearFiltersEvent(r, this);
                    }
                }
                for (let i = 0; i < this.tableCellCrs.length; i++) {
                    if (this.tableCellCrs[i].instance.processClearFiltersEvent != undefined) {
                        this.tableCellCrs[i].instance.processClearFiltersEvent(r, this);
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
        this._sub.add(
            this.onSortEvent.subscribe(r => {
                for (let i = 0; i < this.columnFilterCrs.length; i++) {
                    if (this.columnFilterCrs[i].instance.processSortEvent != undefined) {
                        this.columnFilterCrs[i].instance.processSortEvent(r, this);
                    }
                }
                for (let i = 0; i < this.tableCellCrs.length; i++) {
                    if (this.tableCellCrs[i].instance.processSortEvent != undefined) {
                        this.tableCellCrs[i].instance.processSortEvent(r, this);
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
            this._sub.add(
                this.captionCr.instance.onEvent.subscribe(r => {
                    for (let i = 0; i < this.columnFilterCrs.length; i++) {
                        if (this.columnFilterCrs[i].instance.processCaptionEvent != undefined) {
                            this.columnFilterCrs[i].instance.processCaptionEvent(r, this);
                        }
                    }
                    for (let i = 0; i < this.tableCellCrs.length; i++) {
                        if (this.tableCellCrs[i].instance.processCaptionEvent != undefined) {
                            this.tableCellCrs[i].instance.processCaptionEvent(r, this);
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
            this._sub.add(
                this.columnFilterCrs[i].instance.onEvent.subscribe(r => {
                    for (let t = 0; t < this.tableCellCrs.length; t++) {
                        if (this.tableCellCrs[t].instance.colIdx == this.columnFilterCrs[i].instance.colIdx) {
                            if (this.tableCellCrs[t].instance.processColumnFilterEvent != undefined) {
                                this.tableCellCrs[t].instance.processColumnFilterEvent(r, this);
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
                        const cfg = r as BaseTableEvent;
                        const event = cfg.event as FilterDescriptor;

                        // console.log('event filter')
                        // console.log(event)

                        if (event.field !== '' && event.field !== undefined && event.field !== null) {
                            let filterIdx = -1;
                            const filters = this.state.filter.filters as FilterDescriptor[];

                            // console.log('filter before stuff')
                            // console.log(filters)

                            for (let i = 0; i < filters.length; i++) {
                                if (filters[i].field == event.field) {
                                    filterIdx = i;
                                }
                            }

                            if (filterIdx > -1) {
                                filters.splice(filterIdx, 1);
                            }

                            // console.log('filter after splice')
                            // console.log(filters)

                            if (Array.isArray(event.value)) {
                                const arrayVal = event.value as any[];

                                if (arrayVal.length != 0) {
                                    filters.push(event);
                                }
                            } else {
                                if (event.value !== undefined && event.value !== null && event.value !== "") {
                                    filters.push(event);
                                } else {
                                    if (event.operator == 'isnull' || event.operator == 'isnotnull') {
                                        filters.push({
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

        this.initTableCellCrEvents()
        this.initDisplayItemCrEvents();
    }

    // initTableCellCrEvents subscribes all components to table cell events which occur
    // when user emits event from table cell, which is usually a custom action
    //
    // The reason this is a seperate function and not used within our "initCRSEvents" function
    // is because this needs to be reused everytime our table gets new data
    protected initTableCellCrEvents() {
        for (let i = 0; i < this.tableCellCrs.length; i++) {
            this._tableCellSub.add(
                this.tableCellCrs[i].instance.onEvent.subscribe(r => {
                    for (let t = 0; t < this.columnFilterCrs.length; t++) {
                        if (this.columnFilterCrs[t].instance.colIdx == this.tableCellCrs[i].instance.colIdx) {
                            if (this.columnFilterCrs[t].instance.processTableCellEvent != undefined) {
                                this.columnFilterCrs[t].instance.processTableCellEvent(r, this);
                            }
                        }
                    }

                    if (this.captionCr != undefined && this.captionCr.instance.processTableCellEvent != undefined) {
                        this.captionCr.instance.processTableCellEvent(r, this);
                    }
                    if (this.config.processTableCellEvent != undefined) {
                        this.config.processTableCellEvent(r, this);
                    }
                })
            );
        }
    }

    protected initDisplayItemCrEvents() {
        for (let i = 0; i < this.displayItemCrs.length; i++) {
            this._displayItemSub.add(
                this.displayItemCrs[i].instance.onEvent.subscribe(r => {
                    for (let t = 0; t < this.displayItemCrs.length; t++) {
                        if (this.displayItemCrs[t].instance.colIdx == this.displayItemCrs[i].instance.colIdx) {
                            if (this.displayItemCrs[t].instance.processDisplayItemEvent != undefined) {
                                this.displayItemCrs[t].instance.processDisplayItemEvent(r, this);
                            }
                        }
                    }

                    if (this.captionCr != undefined && this.captionCr.instance.processDisplayItemEvent != undefined) {
                        this.captionCr.instance.processDisplayItemEvent(r, this);
                    }
                    if (this.config.processDisplayItemEvent != undefined) {
                        this.config.processDisplayItemEvent(r, this);
                    }
                })
            );
        }
    }

    protected initAfterView() {
        this.initDynamicComponents()
        this.saveHiddenColumns();
        this.saveHiddenColumnFilters();
        this.refresh();
        this.cdr.detectChanges();
    }

    protected initDynamicComponents() {
        this.initCaptionComponent();
        this.initExpansionComponents();
        this.initColumnFilterComponents();
        this.initCellComponents();
    }

    ///////////////////////////////////////////
    // HELPER FUNCTIONS
    ///////////////////////////////////////////

    // addHiddenColumn decreases our "visibleColumns" variable which is used for
    // row expansion
    // 
    // This function should be used instead of trying to override "visibleColumns" manually
    public addHiddenColumn(field: string) {
        const columns: CoreColumn[] = this.columns;

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
        const columns: CoreColumn[] = this.columns;

        for (let i = 0; i < columns.length; i++) {
            if (columns[i].field == field) {
                columns[i].hideColumn = false;
                this.visibleColumns++;
            }
        }

        console.log('remove visible columns: ' + this.visibleColumns);
    }

    // saveHiddenColumnFilters is used to gather initial hidden column filters on table init
    // These are used later whenever a user clicks "Clear Filters" button; we can loop
    // through _hiddenColumnFilters array and set that column state back to initial load
    protected saveHiddenColumnFilters() {
        const columns: CoreColumn[] = this.columns;

        for (let i = 0; i < columns.length; i++) {
            if (columns[i].hideColumnFilter) {
                this._hiddenColumnFilters.push(columns[i].field);
            }
        }
    }

    // saveHiddenColumns is used to gather initial hidden columns on table init
    // These are used later whenever a user clicks "Clear Filters" button; we can loop
    // through _hiddenColumns array and set that column state back to initial load
    protected saveHiddenColumns() {
        const columns: CoreColumn[] = this.columns;

        for (let i = 0; i < columns.length; i++) {
            if (columns[i].hideColumn) {
                console.log('column ' + i + ' hidden');
                this._hiddenColumns.push(columns[i].field);
            } else {
                this.visibleColumns++;
            }
        }
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
            this._tableInit = true;
            this._updateTableCellComponents = true;
            this._updateDisplayItemComponents = true;
            this.filterData = res.body;

            this.onTableFilterEvent.emit({
                eventType: TableEvents.tableFilter,
                event: res
            });

            if (this.config.tableAPIConfig.processResult != undefined) {
                this.config.tableAPIConfig.processResult(r, this);
            }
        }, (err) => {
            if (this.config.tableAPIConfig.processError != undefined) {
                this.config.tableAPIConfig.processError(err);
            }
        });
    }

    // clearFilters will clear current object's filter state
    // of filter, sort and group by and then update the table
    // by making call to server
    public clearFilters() {
        if (this.config.getState != undefined) {
            this.state = this.config.getState(this.outerData);
        } else {
            this.state.filter = {
                logic: 'and',
                filters: []
            };
            this.state.sort = [];
        }

        this.onClearFiltersEvent.emit({
            eventType: TableEvents.clearFilters,
        });
        this.columnFilterCrs.forEach(item => {
            item.instance.clearFilter();
        })

        for (let i = 0; i < this.columns.length; i++) {
            for (let k = 0; k < this._hiddenColumnFilters.length; k++) {
                if (this._hiddenColumnFilters[k] == this.columns[i].field) {
                    this.columns[i].hideColumnFilter = true;
                }
            }
            for (let k = 0; k < this._hiddenColumns.length; k++) {
                if (this._hiddenColumns[k] == this.columns[i].field) {
                    console.log('hide column ' + i)
                    this.columns[i].hideColumn = true;
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
                this.getGridInfo(
                    this.config.tableAPIConfig.apiURL(this.outerData) +
                    encodeURIState(this.state, this.config.paramConfig)
                );
            }
        }
    }

    // updateSettings updates a table's column filters if they are dynamic based
    public updateSettings() {
        if (this.config.customTableSettingsSearch != undefined) {
            this.config.customTableSettingsSearch(this);
        } else {
            if (
                this.config.tableSettingsAPIConfig != undefined &&
                this.config.tableSettingsAPIConfig.apiURL(this.outerData) != "" &&
                this.config.tableSettingsAPIConfig.apiURL(this.outerData) != null
            ) {
                const config = this.config.tableSettingsAPIConfig;

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
    }

    // refresh simply combines querying for table data and table settings
    public refresh() {
        this.update();
        this.updateSettings();
    }

    ///////////////////////////////////////////
    // SET FUNCTIONS
    ///////////////////////////////////////////

    public setTableConfig(cfg: BaseTableConfig) {
        this.config = cfg;
    }

    ///////////////////////////////////////////
    // GET FUNCTIONS
    ///////////////////////////////////////////

    public getTableConfig(): BaseTableConfig {
        return this.config;
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
        this.http.get<any>(
            url,
            { withCredentials: true, observe: 'response', responseType: 'blob' }
        ).subscribe(r => {
            const res = r as HttpResponse<any>
            const newBlob = new Blob([res.body], blobOpts);

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
        this._sub.unsubscribe();
        this._tableCellSub.unsubscribe();
        this._displayItemSub.unsubscribe();

        if (this.captionCr != undefined) {
            this.captionCr.destroy();
        }

        for (let i = 0; i < this.columnFilterCrs.length; i++) {
            this.columnFilterCrs[i].destroy();
        }
        for (let i = 0; i < this.tableCellCrs.length; i++) {
            this.tableCellCrs[i].destroy();
        }
        for (let i = 0; i < this.rowExpansionCrs.length; i++) {
            this.rowExpansionCrs[i].destroy();
        }

        this.captionCr = null;
        this.columnFilterCrs = null;
        this.tableCellCrs = null;
        this.rowExpansionCrs = null;
        this._hiddenColumnFilters = null;
        this._hiddenColumns = null;
    }
}
