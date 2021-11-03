import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, EventEmitter, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { BaseTableEvent, State, CoreColumn } from '../../../table-api';
import { Subscription } from 'rxjs';
import { BaseComponent } from '../../base/base.component';
import { BaseTableEventComponent } from '../base-table-event/base-table-event.component';
import { BaseColumnComponent } from '../../table/base-column/base-column.component'
import { BaseRowExpansionComponent } from '../../table/base-row-expansion/base-row-expansion.component'
import { PrimengTableConfig } from '../../primeng/primeng-table/primeng-table.component';
import { getDefaultState } from '../../../default-values'
import { TableCaptionDirective } from '../../../directives/table/table-caption.directive';
import { TableExpansionDirective } from '../../../directives/table/table-expansion.directive';
import { TableBodyCellDirective } from '../../../directives/table/table-body-cell.directive';
import { TableColumnFilterDirective } from '../../../directives/table/table-column-filter.directive';
import { HttpService } from '../../../services/http.service';
import { BaseTableCaptionComponent, BaseTableCellDirective, BaseTableConfig, ColumnEntity, encodeURIState, FilterData, FilterDescriptor } from 'projects/custom-table/src/public-api';
import { HttpResponse } from '@angular/common/http';


@Component({
    selector: 'lib-base-table',
    templateUrl: './base-table.component.html',
    styleUrls: ['./base-table.component.scss']
})
export abstract class BaseTableComponent extends BaseComponent implements OnInit, AfterViewInit {
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
    @ViewChildren(TableExpansionDirective)
    public expansionDirs: QueryList<TableExpansionDirective>;
    @ViewChildren(TableBodyCellDirective)
    public bodyCellDirs: QueryList<TableBodyCellDirective>;
    // @ViewChildren(TableInputTemplateDirective)
    // public inputTemplateDirs: QueryList<TableInputTemplateDirective>;
    // @ViewChildren(TableOutputTemplateDirective)
    // public outputTemplateDirs: QueryList<TableOutputTemplateDirective>;
    @ViewChildren(TableColumnFilterDirective)
    public columnFilterDirs: QueryList<TableColumnFilterDirective>;
    // @ViewChildren(TableCellDirective)
    // public tableCellDirs: QueryList<TableCellDirective>;

    // captionCr keeps a reference to dynamically created caption component which can be 
    // modified through different events and will be destroyed on component destruction
    public captionCr: ComponentRef<BaseTableCaptionComponent>;

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

    // visibleColumns keeps track of the total number of visible columns
    // This is needed for when we use row expansion, the UI needs to know how
    // many columns are in the "above" table in order to render correctly
    public visibleColumns: number = 0;

    // state keeps track of the current table's filter state and is the info that is 
    // sent to the server whenever a column filter is used or pagination occurs
    public state: State = getDefaultState();

    // columns represents the columns of table and various config for each column
    // including column filter, body cell etc.
    public columns: CoreColumn[];

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

    ///////////////////////////////////////////
    // INIT COLUMN COMPONENTS
    ///////////////////////////////////////////

    // initExpansionComponents initializes row expansion component reference
    // and creates component if set by api
    private initExpansionComponents() {
        this._sub.add(
            this.expansionDirs.changes.subscribe(val => {
                //console.log("expansion dir");
                //console.log(val);

                if (val.last && this.config.rowExpansion && this._expansionLen < val.length) {
                    //console.log('expansion being created')
                    const e = val.last as TableExpansionDirective

                    const cr = e.viewContainerRef.createComponent(
                        this.cfr.resolveComponentFactory(
                            this.config.rowExpansion.component,
                        )
                    );
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
        this._sub.add(
            this.columnFilterDirs.changes.subscribe(val => {
                if (this._updateColumnFilter) {
                    const results = val._results as TableColumnFilterDirective[];
                    results.forEach((item) => {
                        const columns: CoreColumn[] = this.columns

                        const cf = this.cfr.resolveComponentFactory(
                            columns[item.colIdx].columnFilter.component
                        );

                        const cr = item.viewContainerRef.createComponent(cf);
                        cr.instance.componentRef = this;
                        cr.instance.colIdx = item.colIdx;
                        cr.instance.isColumnFilter = true;
                        cr.instance.isInputTemplate = false;

                        cr.instance.field = columns[item.colIdx].columnFilter.field;
                        cr.instance.value = columns[item.colIdx].columnFilter.value;
                        cr.instance.selectedValue = columns[item.colIdx].columnFilter.selectedValue;
                        cr.instance.config = columns[item.colIdx].columnFilter.config;
                        cr.instance.excludeFilter = columns[item.colIdx].columnFilter.excludeFilter;

                        if (columns[item.colIdx].columnFilter.operator != undefined) {
                            cr.instance.operator = columns[item.colIdx].columnFilter.operator;
                        }

                        this.columnFilterCrs.push(cr);
                    });
                }

                this._updateColumnFilter = false;
            })
        )
    }

    // createCellComponentRef creates and return a component reference based on the directive
    // and ComponentRef passed
    private createCellComponentRef(dir: BaseTableCellDirective, ce: ColumnEntity): ComponentRef<BaseColumnComponent> {
        const cf = this.cfr.resolveComponentFactory(ce.component);
        const cr = dir.viewContainerRef.createComponent(cf);
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

    private initCellComponents() {
        const columns: CoreColumn[] = this.columns;

        this._sub.add(
            this.bodyCellDirs.changes.subscribe(val => {
                // console.log('change within body cell')
                // console.log(val)

                if (this._updateBodyCellComponents) {
                    //console.log('body cell dirs')

                    // If table has already been initialized, destroy current component references
                    // and assign bodyCellCrs to empty array;
                    if (this._tableInit) {
                        this.bodyCellCrs.forEach(item => {
                            item.destroy();
                        })
                        this.bodyCellCrs = [];
                    }

                    const results = val._results as TableBodyCellDirective[];
                    results.forEach(item => {
                        let ce = columns[item.colIdx].bodyCell
                        this.bodyCellCrs.push(this.createCellComponentRef(item, ce));
                    });

                    // If table has already been initialized, unsubscribe from current
                    // body cell subscriptions and assign "_bodyCellSubs" to empty array
                    // and then initialize new body cell component references 
                    if (this._tableInit) {
                        this._bodyCellSub.unsubscribe();
                        this.initBodyCellCrEvents()
                    }

                    this.cdr.detectChanges();
                    this._updateBodyCellComponents = false;
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
            cr.instance.componentRef = this;
            this.captionCr = cr;
        }
    }

    // initCRSEvents is in charge of taking all of the initialized components
    // references and subscribing them all to each other's events and having
    // ability for all parts of the table to listen to each other 
    private initCRSEvents() {
        // subscribing all components to table filter event, which occurs
        // whenever new data is written to table via column filter,
        // pagination, etc.
        this._sub.add(
            this._onTableFilterEvent.subscribe(r => {
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
        this._sub.add(
            this._onClearFiltersEvent.subscribe(r => {
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
        this._sub.add(
            this._onSortEvent.subscribe(r => {
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
            this._sub.add(
                this.captionCr.instance.onEvent.subscribe(r => {
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
            this._sub.add(
                this.columnFilterCrs[i].instance.onEvent.subscribe(r => {
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

        this.initBodyCellCrEvents()
    }

    // initBodyCellCrEvents subscribes all components to body cell events which occur
    // when user emits event from body cell, which is usually a custom action
    //
    // The reason this is a seperate function and not used within our "initCRSEvents" function
    // is because this needs to be reused everytime our table gets new data
    private initBodyCellCrEvents() {
        for (let i = 0; i < this.bodyCellCrs.length; i++) {
            this._bodyCellSub.add(
                this.bodyCellCrs[i].instance.onEvent.subscribe(r => {
                    for (let t = 0; t < this.columnFilterCrs.length; t++) {
                        if (this.columnFilterCrs[t].instance.colIdx == this.bodyCellCrs[i].instance.colIdx) {
                            if (this.columnFilterCrs[t].instance.processBodyCellEvent != undefined) {
                                this.columnFilterCrs[t].instance.processBodyCellEvent(r, this);
                            }
                        }
                    }

                    if (this.captionCr != undefined && this.captionCr.instance.processBodyCellEvent != undefined) {
                        this.captionCr.instance.processBodyCellEvent(r, this);
                    }
                    if (this.config.processBodyCellEvent != undefined) {
                        this.config.processBodyCellEvent(r, this);
                    }
                })
            );
        }
    }

    private initAfterView() {
        this.initDynamicComponents()
        this.saveHiddenColumns();
        this.saveHiddenColumnFilters();
        this.refresh();
        this.cdr.detectChanges();
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
    private saveHiddenColumns() {
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

            this._tableInit = true;
            const bte: BaseTableEvent = {
                event: res
            }

            this._onTableFilterEvent.emit(bte);
            this._updateBodyCellComponents = true;

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

        const columns: CoreColumn[] = this.columns;

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
                this.getGridInfo(
                    this.config.tableAPIConfig.apiURL(this.outerData) +
                    encodeURIState(this.state, this.config.paramConfig)
                );
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

    // refresh simply combines querying for table data and table settings
    public refresh() {
        this.update();
        this.updateSettings();
    }
}
