import { Component, OnInit, Input, ViewChild, ViewChildren, QueryList, AfterViewInit, ChangeDetectorRef, ComponentFactoryResolver, OnDestroy, ComponentRef, EventEmitter } from '@angular/core';
import { TabPanelItem, TabViewConfig, RowExpansionItemsI } from '../../../table-api';
import { DynamicTabPanelDirective } from '../../../directives/dynamic-tab-panel.directive';
import { TabView } from 'primeng/tabview';
import { Subscribable, Subscription } from 'rxjs';

@Component({
    selector: 'app-base-tab-view',
    templateUrl: './base-tab-view.component.html',
    styleUrls: ['./base-tab-view.component.scss']
})
export class BaseTabViewComponent implements OnInit, AfterViewInit, OnDestroy {
    private _openedPanelIdxs: number[] = [];
    private _panelCrs: ComponentRef<RowExpansionItemsI>[] = [];

    @Input() public config: TabViewConfig;
    @Input() public outerData: any;
    @Input() public renderCallback: EventEmitter<any>;
    @ViewChildren(DynamicTabPanelDirective) public panels: QueryList<DynamicTabPanelDirective>;

    constructor(
        public cdr: ChangeDetectorRef,
        public cfr: ComponentFactoryResolver,
    ) { }

    private createPanelComponent(item: DynamicTabPanelDirective) {
        const cf = this.cfr.resolveComponentFactory(
            this.config.panels[item.tabIdx].contentComponent,
        );

        const cr = item.viewContainerRef.createComponent(cf);
        cr.instance.config = this.config.panels[item.tabIdx].config;
        cr.instance.outerData = this.outerData;
        this._panelCrs.push(cr);
        this.cdr.detectChanges();

        // console.log('tab view config')
        // console.log(this.config.panels[item.tabIdx].config)
    }

    private initTabView() {
        this.panels.forEach((item) => {
            if (
                this.config.selectedIdx == item.tabIdx &&
                this.config.panels[item.tabIdx].contentComponent != undefined
            ) {
                this._openedPanelIdxs.push(item.tabIdx)
                this.createPanelComponent(item)
            }
        });

        this.cdr.detectChanges();

        // if(this.panelSub != undefined && !this.panelSub.closed){
        //   this.panelSub.unsubscribe();
        // }

        // this.panelSub = this.panels.changes.subscribe(t => {
        //   //console.log("panel change");
        //   //console.log(t);
        // })
    }

    public change(event: any) {
        //console.log('change event')
        let found = false;

        for (let i = 0; i < this._openedPanelIdxs.length; i++) {
            if (this._openedPanelIdxs[i] == event.index) {
                found = true;
                break
            }
        }

        if (!found) {
            //console.log('creating due to not found');
            this._openedPanelIdxs.push(event.index);
            this.createPanelComponent(this.panels.toArray()[event.index])
        }
    }

    public ngOnInit(): void {
        //this.cdr.detectChanges();
        this.renderCallback.emit(null);
        //console.log("tab view activated")
    }

    public ngAfterViewInit() {
        //console.log("tab view after view init")
        this.initTabView();

        //console.log("panel length " + this.panels.length);
    }

    public ngOnDestroy() {
        //console.log('tab view destroy activated');
        //this.panelSub.unsubscribe();

        for (let i = 0; i < this._panelCrs.length; i++) {
            this._panelCrs[i].destroy();
        }

        this._panelCrs = null;
    }
}
