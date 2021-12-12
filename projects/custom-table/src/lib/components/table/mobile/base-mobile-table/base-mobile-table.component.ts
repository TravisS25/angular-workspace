import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, Directive, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, Type, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { getDefaultState } from '../../../../default-values';
import { Subject, Subscription } from 'rxjs';
import _ from "lodash" // Import the entire lodash library
import { encodeURIState } from '../../../../util';
import { setTableEvents } from '../../table-util';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/combineLatest';
import { take } from 'rxjs/operators';
import { BaseMobileTableConfig, DisplayItemEntity, State, FilterData, MobileTableRowEvent, DefaultTableEvents, DefaultEvents } from '../../../../table-api';
import { BaseDisplayItemComponent } from '../../../table/base-display-item/base-display-item.component';
import { MatTable } from '@angular/material/table';
import { HttpService } from '../../../../services/http.service';
import { BaseComponent } from '../../../base/base.component'
import { BaseTableEvent, TableEvents } from '../../../../table-api'
import { TableRowExpansionDirective } from '../../../../directives/table/table-row-expansion.directive';
import { BaseEventComponent } from '../../base-event/base-event.component';
import { TableDisplayItemDirective } from '../../../../directives/table/table-display-item.directive';
import { TableCaptionDirective } from '../../../../directives/table/table-caption.directive'

@Component({
    selector: 'lib-base-mobile-table',
    templateUrl: './base-mobile-table.component.html',
    styleUrls: ['./base-mobile-table.component.scss']
})
export abstract class BaseMobileTableComponent extends BaseComponent implements OnInit {
    // _isTableInit is flag used to indicate whether table has been
    // initialized for the first time or not
    //
    // This is used to make sure we only create table caption once
    // Once table is initialized this will be set to true
    private _isTableInit: boolean = false;

    // _displayItemSub is subscription that keeps track of all display item events
    private _displayItemSub: Subscription = new Subscription()

    // _displayItemRender is subject that we use as a "flag" to indicate when
    // all the dynamically generated display items are done rendering so we
    // can then subscribe events with rest of table
    private _displayItemRender: Subject<void> = new Subject();

    // _updateDisplayItem is used as flag to indicate whether to update
    // mobile table's panel description section
    // This will be set to false once receiving info from server and 
    // will be set back to true on every call to server
    protected _updateDisplayItem: boolean = true;

    // filterData is the data and total records that is retrieved from server
    public filterData: FilterData

    // state is current filter state of table
    public state: State;

    // captionCr is component ref to table caption
    public captionCr: ComponentRef<BaseEventComponent>;

    // displayItemCrs is list of component refs for table's display items
    public displayItemCrs: ComponentRef<BaseDisplayItemComponent>[] = [];

    // rowExpansionDirs is list of component refs for table's expansion items
    public rowExpansionCrs: ComponentRef<BaseComponent>[] = [];

    // captionDir is directive to dynamically generate table caption
    @ViewChild(TableCaptionDirective) public captionDir: TableCaptionDirective;

    // displayItemDirs is list of directives to dynamically generate display item components
    @ViewChildren(TableDisplayItemDirective) public displayItemDirs: QueryList<TableDisplayItemDirective>;

    // tableRowExpansionDirs is list of directives to dynamically generate row expansion components
    @ViewChildren(TableRowExpansionDirective) public rowExpansionDirs: QueryList<TableRowExpansionDirective>;

    // config is config for table
    @Input() public config: BaseMobileTableConfig;

    // onTableFilterEvent is used by other components of the table like caption,
    // column filter and body cell rows and will be emitted by table whenever
    // new data is loaded into the table via column filter or pagination
    @Output() public onTableFilterEvent: EventEmitter<BaseTableEvent> = new EventEmitter<BaseTableEvent>();

    constructor(
        public http: HttpService,
        public cfr: ComponentFactoryResolver,
        public cdr: ChangeDetectorRef,
    ) {
        super()
    }

    // getTableInfo makes request to server for table records and total
    // number of records based off of current filter
    private getTableInfo() {
        this.http.get<any>(
            this.config.tableAPIConfig.apiURL(this.outerData) +
            encodeURIState(this.state, this.config.paramConfig),
            this.config.tableAPIConfig.apiOptions as any
        ).subscribe(r => {
            const res = r as HttpResponse<FilterData>;
            this._updateDisplayItem = true;
            this.filterData = res.body;

            this.onTableFilterEvent.emit({
                event: res,
            })
        }, (err: HttpErrorResponse) => {
            this.onTableFilterEvent.emit({
                event: err
            });
        })
    }

    // destroyDisplayItemCRs is helper function to clean up display item crs
    private destroyDisplayItemCrs() {
        this.displayItemCrs.forEach(x => {
            x.destroy()
        })
        this.displayItemCrs = [];
    }

    // destroyrowExpansionDirs is helper function to clean up row expansion crs
    private destroyRowExpansionCrs() {
        this.rowExpansionCrs.forEach(x => {
            x.destroy();
        });
        this.rowExpansionCrs = [];
    }

    // initValues initiates default values for table properties
    private initValues() {
        if (this.state == undefined) {
            if (this.config.getState != undefined) {
                this.state = this.config.getState(this.outerData);
            } else {
                this.state = getDefaultState();
            }
        }

        if (this.config.paramConfig == undefined) {
            this.config.paramConfig = {};
        }
    }

    // refreshCleanUp is helper function to combine all clean up functions into one call
    private refreshCleanUp() {
        this._displayItemSub.unsubscribe();
        this.destroyDisplayItemCrs();
        this.destroyRowExpansionCrs();
    }

    // initCrEvents initiates all components to listen to each others events once they created 
    private initCrEvents() {
        this._sub.add(
            this._displayItemRender.subscribe(d => {
                if (!this._isTableInit) {
                    this._sub.add(
                        this.captionCr.instance.onEvent.subscribe(r => {
                            if (this.captionCr.instance.processCaptionEvent != undefined) {
                                this.captionCr.instance.processCaptionEvent(r, this);
                            }

                            this.displayItemCrs.forEach(item => {
                                if (item.instance.processCaptionEvent != undefined) {
                                    item.instance.processCaptionEvent(r, this);
                                }
                            })
                        })
                    )

                    this._isTableInit = true;
                }

                this.displayItemCrs.forEach(item => {
                    this._displayItemSub.add(
                        item.instance.onEvent.subscribe(r => {
                            if (item.instance.processDisplayItemEvent != undefined) {
                                item.instance.processDisplayItemEvent(r, this);
                            }

                            if (this.captionCr.instance.processDisplayItemEvent != undefined) {
                                this.captionCr.instance.processDisplayItemEvent(r, this)
                            }
                        })
                    )
                })
            })
        )
    }

    // initCRs initiates and creates all dynamic components of table
    private initCRs() {
        if (this.config.caption != undefined && this.captionDir != undefined) {
            this.captionCr = this.captionDir.viewContainerRef.createComponent(
                this.cfr.resolveComponentFactory(this.config.caption.component),
            )

            this.captionCr.instance.config = this.config.caption.config;
            this.captionCr.instance.componentRef = this;
            this.captionCr.instance.outerData = this.outerData;
        }

        if (this.config.rowEntity != undefined) {
            this._sub.add(
                this.displayItemDirs.changes.subscribe(val => {
                    if (this._updateDisplayItem) {
                        const results = val._results as TableDisplayItemDirective[];
                        results.forEach((item) => {
                            const cr = item.viewContainerRef.createComponent(
                                this.cfr.resolveComponentFactory(
                                    this.config.rowEntity.component
                                )
                            );

                            cr.instance.config = this.config.rowEntity.config;
                            cr.instance.componentRef = this;
                            cr.instance.outerData = this.outerData;
                            cr.instance.value = this.config.rowEntity.value;
                            cr.instance.colIdx = 0;
                            cr.instance.rowData = item.rowData;
                            cr.instance.rowIdx = 0;
                            cr.instance.processRowData = this.config.rowEntity.processRowData;
                            setTableEvents(cr.instance, this.config.rowEntity);

                            this.displayItemCrs.push(cr);
                        });
                        this._displayItemRender.next();
                    }
                })
            );
        }

        this.cdr.detectChanges();
    }

    // search is helper function to either initiate a default request
    // or to create a custom request based on customTableSearch passed
    private search() {
        if (this.config.customTableSearch != undefined) {
            this.config.customTableSearch(this);
        } else {
            this.getTableInfo();
        }
    }

    public ngOnInit(): void {
        this.initCrEvents();
        this.initValues();
    }

    public ngAfterViewInit() {
        this.initCRs();
        this.search();
    }

    // onRowClick will only work when config#rowEvent is initialized
    public onRowClick(event: any, rowData: any) {
        if (this.config.rowEvent != undefined) {
            const cfg: MobileTableRowEvent = {
                actionEvent: event,
                rowData: rowData,
            }
            this.config.rowEvent(
                {
                    eventFieldName: DefaultEvents.Click,
                    event: cfg,
                },
                this
            );
        }
    }

    // refresh is helper function that both cleans up crs and initiates request to server
    public refresh() {
        this.refreshCleanUp();
        this.search();
    }

    // clearFilters clears the table's state and makes request to server
    public clearFilters() {
        if (this.config.getState != undefined) {
            this.state = this.config.getState(this.outerData);
        } else {
            this.state = getDefaultState();
        }

        if (this.config.processClearFiltersEvent != undefined) {
            this.config.processClearFiltersEvent({}, this)
        }

        this.refresh();
    }

    public ngOnDestroy() {
        this.refreshCleanUp();
        this._sub.unsubscribe();
    }

    public abstract rowCollapse(rowIdx: number, rowKeyMap: string);
    public abstract rowExpand(rowIdx: number, rowKeyMap: string);
    public abstract onPageChange(event: any);
    public abstract closeRows();
}
