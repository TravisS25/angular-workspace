import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, Directive, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { DefaultEvents } from '../../../../config';
import { BaseTableEvent, BaseDisplayItem, DisplayItemEntity } from '../../../../table-api';

export interface DisplayItemConfig {
    style?: Object;
    class?: string;
    entity?: DisplayItemEntity;
}

export interface DisplayItemEvent extends DisplayItemConfig {
    rowData?: any;
    rowIdx?: number;
}

@Directive({
    selector: '[displayItemDirective]'
})
export class DisplayItemDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}

@Component({
    selector: 'lib-display-item',
    templateUrl: './display-item.component.html',
    styleUrls: ['./display-item.component.scss']
})
export class DisplayItemComponent extends BaseDisplayItem implements OnInit, AfterViewInit, OnDestroy {
    private _sub: Subscription = new Subscription();

    @ViewChild(DisplayItemDirective) public dir: DisplayItemDirective;
    @Input() public config: DisplayItemConfig;

    constructor(
        public cdr: ChangeDetectorRef,
        public cfr: ComponentFactoryResolver,
    ) { super() }

    private initValues() {
        if (this.config == undefined && this.processRowData == undefined) {
            throw (
                'MUST SET CONFIG OR PROCESS ROW DATA FOR DISPLAY ITEM COMPONENT AT IDX ' + this.rowIdx + '!'
            );
        }
        if (this.processRowData != undefined) {
            this.config = this.processRowData(this.rowData);
        }
    }

    private initCR() {
        if (this.config.entity) {
            const cr = this.dir.viewContainerRef.createComponent(
                this.cfr.resolveComponentFactory(
                    this.config.entity.component
                )
            )

            cr.instance.outerData = this.outerData;
            cr.instance.rowData = this.rowData;
            cr.instance.rowIdx = this.rowIdx;
            cr.instance.baseTable = this.baseTable;
            cr.instance.value = this.config.entity.value;
            cr.instance.config = this.config.entity.config;
            cr.instance.processEvent = this.config.entity.processEvent;
            cr.instance.processRowData = this.config.entity.processRowData;

            if (cr.instance.processEvent != undefined) {
                this._sub.add(
                    cr.instance.onEvent.subscribe(r => {
                        cr.instance.processEvent(r, this.baseTable);
                    })
                );
            }
        }
    }

    public ngOnInit(): void {
        this.initValues();
    }

    public ngAfterViewInit() {
        this.initCR();
    }

    public ngOnDestroy() {

    }

    public onClick() {
        console.log('click event activated here')

        const e: DisplayItemEvent = this.config
        e.rowData = this.rowData;
        e.rowIdx = this.rowIdx;

        const cfg: BaseTableEvent = {
            eventType: DefaultEvents.Click,
            event: e,
        }

        this.onEvent.emit(cfg);

        if (this.processEvent != undefined) {
            this.processEvent(cfg, this.baseTable);
        }
    }

}
