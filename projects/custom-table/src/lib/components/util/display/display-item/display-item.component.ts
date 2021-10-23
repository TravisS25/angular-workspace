import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, Directive, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { DefaultEvents } from '../../../../config';
import { BaseTableEvent, DisplayItemEntity } from '../../../../table-api';
import { BaseDisplayItemComponent } from '../../../table/base-display-item/base-display-item.component';

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
export class DisplayItemComponent extends BaseDisplayItemComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(DisplayItemDirective) public dir: DisplayItemDirective;
    @Input() public config: DisplayItemConfig;

    constructor(
        public cdr: ChangeDetectorRef,
        public cfr: ComponentFactoryResolver,
    ) { super() }

    private initValues() {
        if (this.config == undefined && this.processRowData == undefined) {
            throw (
                'MUST SET CONFIG OR PROCESS ROW DATA FOR DISPLAY ITEM COMPONENT AT COL IDX ' + this.colIdx + '!'
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
            cr.instance.componentRef = this.componentRef;
            cr.instance.value = this.config.entity.value;
            cr.instance.config = this.config.entity.config;
            cr.instance.processRowData = this.config.entity.processRowData;

            this._sub.add(
                cr.instance.onEvent.subscribe(r => {
                    if (cr.instance.processBodyCellEvent != undefined) {
                        cr.instance.processBodyCellEvent(r, this.componentRef)
                    }
                })
            );

            this.cdr.detectChanges();
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

        if (this.processBodyCellEvent != undefined) {
            this.processBodyCellEvent(cfg, this.componentRef);
        }
    }

}
