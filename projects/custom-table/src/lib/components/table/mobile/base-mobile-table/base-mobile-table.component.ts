import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, Directive, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, Type, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { getDefaultState } from '../../../../default-values';
import { Subscription } from 'rxjs';
import _ from "lodash" // Import the entire lodash library
import { encodeURIState } from '../../../../util';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/combineLatest';
import { take } from 'rxjs/operators';
import { BaseMobileTableConfig, DisplayItemEntity, State, FilterData } from '../../../../table-api';
import { BaseDisplayItemComponent } from '../../../table/base-display-item/base-display-item.component';
import { MatTable } from '@angular/material/table';
import { HttpService } from '../../../../services/http.service';
import { BaseComponent } from '../../../base/base.component'
import { BaseEventComponent, BaseTableEvent, TableDisplayItemDirective, setTableEvents, TableCaptionDirective, TableRowExpansionDirective } from 'projects/custom-table/src/public-api';


@Component({
    selector: 'lib-base-mobile-table',
    templateUrl: './base-mobile-table.component.html',
    styleUrls: ['./base-mobile-table.component.scss']
})
export abstract class BaseMobileTableComponent extends BaseComponent implements OnInit {
    private _isTableInit: boolean = false;

    private _displayItemSub: Subscription = new Subscription()

    private _displayItemRender: EventEmitter<void> = new EventEmitter();

    // _updateDisplayItem is used as flag to indicate whether to update
    // mobile table's panel description section
    // This will be set to false once receiving info from server and 
    // will be set back to true on every call to server
    protected _updateDisplayItem: boolean = true;

    // filterData is the data and total records that is retrieved from server
    public filterData: FilterData

    // state is current filter state of table
    public state: State;

    public captionCr: ComponentRef<BaseEventComponent>;
    public displayItemCrs: ComponentRef<BaseDisplayItemComponent>[] = [];
    public tableRowExpansionCrs: Map<number, ComponentRef<BaseComponent>> = new Map();

    @ViewChild(TableCaptionDirective) public captionDir: TableCaptionDirective;
    @ViewChildren(TableDisplayItemDirective) public displayItemDirs: QueryList<TableDisplayItemDirective>;
    @ViewChildren(TableRowExpansionDirective) public tableRowExpansionDirs: QueryList<TableRowExpansionDirective>;

    @Input() public config: BaseMobileTableConfig;

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

    constructor(
        public http: HttpService,
        public cfr: ComponentFactoryResolver,
        public cdr: ChangeDetectorRef,
    ) {
        super()
    }

    private getTableInfo() {
        this.http.get<any>(
            this.config.tableAPIConfig.apiURL(this.outerData) +
            encodeURIState(this.state, this.config.paramConfig),
            this.config.tableAPIConfig.apiOptions as any
        ).subscribe(r => {
            const res = r as HttpResponse<FilterData>;
            this._updateDisplayItem = true;
            this.filterData = res.body;

            if (this.config.processTableFilterEvent != undefined) {
                this.config.processTableFilterEvent(r, this);
            }

            if (this.config.tableAPIConfig.processResult != undefined) {
                this.config.tableAPIConfig.processResult(r, this);
            }
        }, (err: HttpErrorResponse) => {
            if (this.config.tableAPIConfig.processError != undefined) {
                this.config.tableAPIConfig.processError(err)
            }
        })
    }

    private destroyDisplayItemCRs() {
        this.displayItemCrs.forEach(x => {
            x.destroy()
        })
        this.displayItemCrs = [];
    }

    private destroyTableRowExpansionCrs() {
        this.tableRowExpansionCrs.forEach(x => {
            x.destroy();
        });
        this.tableRowExpansionCrs.clear();
    }

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

    private refreshCleanUp() {
        this._displayItemSub.unsubscribe();
        this.destroyDisplayItemCRs();
        this.destroyTableRowExpansionCrs();
    }

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

    private initCRs() {
        if (this.config.caption != undefined && this.captionDir != undefined) {
            this.captionCr = this.captionDir.viewContainerRef.createComponent(
                this.cfr.resolveComponentFactory(this.config.caption.component),
            )

            this.captionCr.instance.config = this.config.caption.config;
            this.captionCr.instance.componentRef = this;
            this.captionCr.instance.outerData = this.outerData;
        }

        if (this.config.displayItem != undefined) {
            this._sub.add(
                this.displayItemDirs.changes.subscribe(val => {
                    if (this._updateDisplayItem) {
                        const results = val._results as TableDisplayItemDirective[];
                        results.forEach((item) => {
                            const cr = item.viewContainerRef.createComponent(
                                this.cfr.resolveComponentFactory(
                                    this.config.displayItem.component
                                )
                            );

                            cr.instance.config = this.config.displayItem.config;
                            cr.instance.componentRef = this;
                            cr.instance.outerData = this.outerData;
                            cr.instance.value = this.config.displayItem.value;
                            cr.instance.colIdx = 0;
                            cr.instance.rowData = item.rowData;
                            cr.instance.rowIdx = 0;
                            cr.instance.processRowData = this.config.displayItem.processRowData;
                            setTableEvents(cr.instance, this.config.displayItem);

                            this.displayItemCrs.push(cr);
                        });
                        this._displayItemRender.emit()
                    }
                })
            );
        }

        this.cdr.detectChanges();
    }

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

    public rowClick(event: any, item: any) {
        if (this.config.rowEvent != undefined) {
            this.config.rowEvent(event, item, this);
        }
    }

    public collapse(rowIdx: number) {
        if (this.config.rowExpansion.collapse != undefined) {
            this.config.rowExpansion.collapse(rowIdx, this);
        }
    }

    public expand(rowIdx: number, rowData: any) {
        if (this.config.rowExpansion.expand != undefined) {
            this.config.rowExpansion.expand(rowIdx, rowData, this);
        }
    }

    public refresh() {
        this.refreshCleanUp();
        this.search();
    }

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

    public abstract onPageChange(event: any);
}
