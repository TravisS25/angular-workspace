import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, Directive, EventEmitter, Input, OnDestroy, OnInit, QueryList, Type, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { getDefaultState } from '../../../default-values';
import { BehaviorSubject, combineLatest, forkJoin, Observable, Subject, Subscription } from 'rxjs';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { MatMenuPanel } from '@angular/material/menu';
import _ from "lodash" // Import the entire lodash library
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { encodeURIState } from '../../../util';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/combineLatest';
import { take } from 'rxjs/operators';
import { BaseDisplayItem, BaseTable, MobileTableConfig, DisplayItemEntity, State, FilterData } from '../../../table-api';
import { BaseMobileTableDirective } from '../../../directives/table/mobile/base-mobile-table.directive';
import { MobileTableExpansionDirective } from '../../../directives/table/mobile/mobile-table-expansion.directive';
import { MobileTableCaptionDirective } from '../../../directives/table/mobile/mobile-table-caption.directive';
import { MobileTablePanelTitleDirective } from '../../../directives/table/mobile/mobile-table-panel-title.directive';
import { MobileTablePanelDescriptionDirective } from '../../../directives/table/mobile/mobile-table-panel-description.directive';
import { MobileTableExpansionPanelDirective } from '../../../directives/table/mobile/mobile-table-expansion-panel.directive';

// @Directive({
//     selector: '[appBaseMobileTable]'
// })
// export class BaseMobileTableDirective {
//     @Input() public rowIdx: number;
//     @Input() public rowData: any;
//     constructor() { }
// }

// @Directive({
//     selector: '[appMobileTableExpansion]'
// })
// export class MobileTableExpansionDirective extends BaseMobileTableDirective {
//     constructor(public viewContainerRef: ViewContainerRef) { super() }
// }

// @Directive({
//     selector: '[appMobileTableCaption]'
// })
// export class MobileTableCaptionDirective {
//     constructor(public viewContainerRef: ViewContainerRef) { }
// }

// @Directive({
//     selector: '[appMobileTablePanelTitle]'
// })
// export class MobileTablePanelTitleDirective extends BaseMobileTableDirective {
//     constructor(public viewContainerRef: ViewContainerRef) { super() }
// }

// @Directive({
//     selector: '[appMobileTablePanelDescription]'
// })
// export class MobileTablePanelDescriptionDirective extends BaseMobileTableDirective {
//     constructor(public viewContainerRef: ViewContainerRef) { super() }
// }

// @Directive({
//     selector: '[appMobileExpansionPanel]'
// })
// export class MobileExpansionPanelDirective extends BaseMobileTableDirective {
//     constructor(public viewContainerRef: MatExpansionPanel) { super() }
// }


@Component({
    selector: 'lib-material-mobile-table',
    templateUrl: './material-mobile-table.component.html',
    styleUrls: ['./material-mobile-table.component.scss']
})
export class MaterialMobileTableComponent extends BaseTable implements OnInit {
    // _isInit is used as flag to indicate whether the mobile table component
    // has been initalized or not
    // This will be set to true once table has been initialized
    //
    // This is internally used to only render table's caption once
    // and every event after will skip this
    private _isInit: boolean = false;

    // _updatePanelDescription is used as flag to indicate whether to update
    // mobile table's panel description section
    // This will be set to false once receiving info from server and 
    // will be set back to true on every call to server
    private _updatePanelDescription: boolean = true;

    // _updatePanelTitle is used as flag to indicate whether to update
    // mobile table's panel title section
    // This will be set to false once receiving info from server and 
    // will be set back to true on every call to server
    private _updatePanelTitle: boolean = true;

    // _panelDescriptionRenderer is used indicate that the panel description
    // section of mobile table is done rendering
    private _panelDescriptionRenderer: Subject<void> = new Subject();

    // _panelTitleRenderer is used indicate that the panel title
    // section of mobile table is done rendering
    private _panelTitleRenderer: Subject<void> = new Subject();

    private _panelTitleEventSubs: Subscription[] = [];
    private _panelDescriptionEventSubs: Subscription[] = [];

    // data is info received from server
    public data: any[];

    // total is the total number of records found 
    // on server for current criteria
    public total: number;

    // state is current filter state of table
    public state: State = getDefaultState();

    public captionCr: ComponentRef<BaseTable>;
    public panelTitleCrs: ComponentRef<BaseDisplayItem>[] = [];
    public panelDescriptionCrs: ComponentRef<BaseDisplayItem>[] = [];
    public tableExpansionCrs: Map<number, ComponentRef<BaseTable>> = new Map();

    @ViewChild(MatAccordion) public table: MatAccordion;
    @ViewChild(MobileTableCaptionDirective) public captionDir: MobileTableCaptionDirective;
    @ViewChildren(MobileTableExpansionDirective) public tableExpansionDirs: QueryList<MobileTableExpansionDirective>;
    @ViewChildren(MobileTableExpansionPanelDirective) public expansionPanelDirs: QueryList<MobileTableExpansionPanelDirective>;
    @ViewChildren(MobileTablePanelDescriptionDirective) public panelDescriptionDirs: QueryList<MobileTablePanelDescriptionDirective>;
    @ViewChildren(MobileTablePanelTitleDirective) public panelTitleDirs: QueryList<MobileTablePanelTitleDirective>;

    @Input() public config: MobileTableConfig;

    constructor(
        public http: HttpClient,
        public cfr: ComponentFactoryResolver,
        public cdr: ChangeDetectorRef,
        public router: Router,
    ) {
        super()
    }

    private search() {
        if (this.config.customSearch != undefined) {
            this.config.customSearch(null);
        } else {
            this.getTableInfo();
        }
    }

    private getTableInfo() {
        this.http.get<any>(
            this.config.tableAPICfg.apiURL(this.outerData) +
            encodeURIState(this.state, this.config.paramCfg),
            this.config.tableAPICfg.apiOptions as any
        ).subscribe(r => {
            const res = r as HttpResponse<FilterData>;
            this._updatePanelDescription = true;
            this._updatePanelTitle = true;
            this.total = res.body.total;
            this.data = res.body.data;

            if (this.config.tableAPICfg.processResult != undefined) {
                this.config.tableAPICfg.processResult(res, this);
            }
        }, (err: HttpErrorResponse) => {
            if (this.config.tableAPICfg.processError != undefined) {
                this.config.tableAPICfg.processError(err)
            }
        })
    }

    private destroyPanelTitleCRs() {
        this.panelTitleCrs.forEach(x => {
            x.destroy();
        });
        this.panelTitleCrs = []
    }

    private destroyPanelDescriptionCRs() {
        this.panelDescriptionCrs.forEach(x => {
            x.destroy();
        });
        this.panelDescriptionCrs = [];
    }

    private destroyTableExpansionCRs() {
        this.tableExpansionCrs.forEach(x => {
            x.destroy();
        });
        this.tableExpansionCrs.clear();
    }

    private unsubscribePanelTitleEvents() {
        this._panelTitleEventSubs.forEach(x => {
            x.unsubscribe();
        });
    }

    private unsubscribePanelDescriptionEvents() {
        this._panelDescriptionEventSubs.forEach(x => {
            x.unsubscribe();
        });
    }

    private initValues() {
        if (this.config.getTableStateChange != undefined) {
            this.state = this.config.getTableStateChange(this.outerData);
        } else if (this.config.getState != undefined) {
            this.state = this.config.getState(this.outerData);
        }

        if (this.config.paramCfg == undefined) {
            this.config.paramCfg = {};
        }
    }

    protected refreshCleanUp() {
        this.unsubscribePanelDescriptionEvents();
        this.unsubscribePanelTitleEvents();
        this.destroyPanelTitleCRs();
        this.destroyPanelDescriptionCRs();
        this.destroyTableExpansionCRs();
    }

    private initCRs() {
        let that = this;

        let setCr = function (
            cr: ComponentRef<BaseDisplayItem>,
            dir: BaseMobileTableDirective,
            panelCfg: DisplayItemEntity,
        ) {
            cr.instance.config = panelCfg.config;
            cr.instance.baseTable = that;
            cr.instance.outerData = that.outerData;
            cr.instance.rowData = dir.rowData
            cr.instance.rowIdx = dir.rowIdx;
            cr.instance.processEvent = panelCfg.processEvent;
            cr.instance.processRowData = panelCfg.processRowData;
        }

        if (this.config.captionCfg != undefined) {
            this.captionCr = this.captionDir.viewContainerRef.createComponent(
                this.cfr.resolveComponentFactory(this.config.captionCfg.component),
            )

            this.captionCr.instance.config = this.config.captionCfg.config;
            this.captionCr.instance.baseTable = this;
            this.captionCr.instance.outerData = this.outerData;
            this.captionCr.instance.processEvent = this.config.captionCfg.processEvent;
        }

        if (this.config.panelTitleCfg != undefined) {
            this._subs.push(
                this.panelTitleDirs.changes.subscribe(val => {
                    if (this._updatePanelTitle) {
                        let results = val._results as MobileTablePanelTitleDirective[];
                        results.forEach(x => {
                            const cr = x.viewContainerRef.createComponent(
                                this.cfr.resolveComponentFactory(this.config.panelTitleCfg.component),
                            )
                            setCr(cr, x, this.config.panelTitleCfg);
                            this.panelTitleCrs.push(cr);
                        });

                        this._panelTitleRenderer.next();
                        this._updatePanelTitle = false;
                        this.cdr.detectChanges();
                    }
                })
            );
        }

        if (this.config.panelDescriptionCfg != undefined) {
            this._subs.push(
                this.panelDescriptionDirs.changes.subscribe(val => {
                    if (this._updatePanelDescription) {
                        let results = val._results as MobileTablePanelDescriptionDirective[];
                        results.forEach(x => {
                            const cr = x.viewContainerRef.createComponent(
                                this.cfr.resolveComponentFactory(this.config.panelDescriptionCfg.component),
                            )
                            setCr(cr, x, this.config.panelDescriptionCfg);
                            this.panelDescriptionCrs.push(cr);
                        });

                        this._panelDescriptionRenderer.next();
                        this._updatePanelDescription = false;
                        this.cdr.detectChanges();
                    }
                })
            );
        }

        this.cdr.detectChanges();
    }


    private initCRSEvents() {
        this._subs.push(
            combineLatest([this._panelDescriptionRenderer, this._panelTitleRenderer]).subscribe(r => {
                if (!this._isInit) {
                    this._isInit = true;
                    this._subs.push(
                        this.captionCr.instance.onEvent.subscribe(r => {
                            if (this.config.processEvent != undefined) {
                                this.config.processEvent(r, this);
                            }
                            this.panelTitleCrs.forEach(item => {
                                if (item.instance.processEvent != undefined) {
                                    item.instance.processEvent(r, this);
                                }
                            })
                            this.panelDescriptionCrs.forEach(item => {
                                if (item.instance.processEvent != undefined) {
                                    item.instance.processEvent(r, this);
                                }
                            })
                        })
                    )
                }

                for (let i = 0; i < this.panelTitleCrs.length; i++) {
                    this._panelTitleEventSubs.push(
                        this.panelTitleCrs[i].instance.onEvent.subscribe(r => {
                            if (this.config.processEvent != undefined) {
                                this.config.processEvent(r, this);
                            }
                            if (this.captionCr.instance.processEvent != undefined) {
                                this.captionCr.instance.processEvent(r, this);
                            }
                            if (this.panelTitleCrs[i].instance.processEvent != undefined) {
                                this.panelTitleCrs[i].instance.processEvent(r, this);
                            }
                        })
                    );
                }

                for (let i = 0; i < this.panelDescriptionCrs.length; i++) {
                    this._panelDescriptionEventSubs.push(
                        this.panelDescriptionCrs[i].instance.onEvent.subscribe(r => {
                            if (this.config.processEvent != undefined) {
                                this.config.processEvent(r, this);
                            }
                            if (this.captionCr.instance.processEvent != undefined) {
                                this.captionCr.instance.processEvent(r, this);
                            }
                            if (this.panelDescriptionCrs[i].instance.processEvent != undefined) {
                                this.panelDescriptionCrs[i].instance.processEvent(r, this);
                            }
                        })
                    );
                }
            }, (err: any) => {
                console.log(err);
            })
        )
    }

    public ngOnInit(): void {
        this.initValues();
        this.initCRSEvents();
        this.search();
    }

    public ngAfterViewInit() {
        this.initCRs();
    }

    public panelClick(event: any, item: any) {
        if (this.config.panelHeaderEvent != undefined) {
            this.config.panelHeaderEvent(event, item, this);
        }
    }

    public refresh() {
        this.refreshCleanUp();
        this.table.closeAll();
        this.search();
    }

    public clearFilters() {
        if (this.config.getState != undefined) {
            this.state = this.config.getState(this.outerData);
        } else {
            this.state = getDefaultState();
        }

        this.refresh();
    }

    public collapse(idx: number) {
        const cr = this.tableExpansionCrs.get(idx);

        if (cr) {
            this.tableExpansionCrs.get(idx).destroy();
            this.tableExpansionCrs.delete(idx);
            this.expansionPanelDirs.toArray()[idx].viewContainerRef.close();
        }
    }

    public expand(expandKey: string, idx: number, rowData: any) {
        if (this.config.expansion.expansionMap == undefined) {
            throw ('EXPANSION MAP FOR CONFIG IS NOT SET FOR MOBILE TABLE!');
        }
        if (!this.config.expansion.expansionMap.has(expandKey)) {
            throw ('EXPAND KEY DOES NOT EXIST!');
        }

        let panel: MatExpansionPanel;

        this.expansionPanelDirs.forEach(x => {
            if (x.rowIdx == idx) {
                panel = x.viewContainerRef;
            }
        })

        panel.afterExpand.pipe(take(1)).subscribe(r => {
            this.tableExpansionDirs.forEach(x => {
                if (x.rowIdx == idx) {
                    const expandCfg = this.config.expansion.expansionMap.get(expandKey);

                    const cr = x.viewContainerRef.createComponent(
                        this.cfr.resolveComponentFactory(expandCfg.component)
                    )

                    cr.instance.config = expandCfg.config;
                    cr.instance.outerData = rowData;
                    this.tableExpansionCrs.set(idx, cr);
                }
            })
        })
        panel.open();
    }

    public onPage(event: PageEvent) {
        this.state.take = event.pageSize;
        this.state.skip = event.pageIndex * event.pageSize;
        this.refresh();
    }

    public ngOnDestroy() {
        this.refreshCleanUp();

        this._subs.forEach(x => {
            x.unsubscribe()
        })

        this._subs = null;
        this._panelTitleEventSubs = null;
        this._panelDescriptionEventSubs = null;
        this.panelTitleCrs = null;
        this.panelDescriptionCrs = null;
    }


}
