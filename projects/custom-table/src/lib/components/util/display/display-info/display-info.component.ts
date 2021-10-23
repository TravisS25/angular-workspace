import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, Directive, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, QueryList, Type, ViewChild, ViewChildren, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { DisplayItemEntity, DisplayFormat, PopupFormI, BaseTableEvent } from '../../../../table-api';
import { Subscription } from 'rxjs';
import { DisplayItemComponent } from '../display-item/display-item.component';
import { BaseDisplayItemComponent } from '../../../table/base-display-item/base-display-item.component';

export interface DisplayInfoItem {
    // colClass is class to determine how much column space each item gets
    colClass?: string;

    // borderClass is class used for display item section
    borderClass?: string;

    // borderStyle is style used for display item section
    borderStyle?: Object;

    // displayHeader is header for current display item
    displayHeader?: DisplayFormat;

    // displayItem is dynamic component generated
    displayEntity: DisplayItemEntity;
}

export interface DisplayInfoConfig {
    // componentRef should be a component reference passed to popup display component
    // that can access the component that called current popup display component
    componentRef?: any;

    // rowData is data from current selected row
    rowData?: any;

    // rowIdx is row index of current selected row
    rowIdx?: number;

    // colIdx is column index of current seelct column
    colIdx?: number;

    // header is header for popup display component
    header?: DisplayFormat;

    // action is dynamic component
    actionEntity?: DisplayItemEntity;

    // displayItems are items to be dynamically created for component
    displayItems: DisplayInfoItem[];
}

@Directive({
    selector: '[libDisplayInfoItem]'
})
export class DisplayInfoItemDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}

@Directive({
    selector: '[libDisplayInfoAction]'
})
export class DisplayInfoActionDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}

@Component({
    selector: 'lib-display-info',
    templateUrl: './display-info.component.html',
    styleUrls: ['./display-info.component.scss']
})
export class DisplayInfoComponent implements OnInit, PopupFormI {
    private _sub: Subscription = new Subscription();

    @Input() public config: DisplayInfoConfig;

    @ViewChildren(DisplayInfoItemDirective) public displayItemDirs: QueryList<DisplayInfoItemDirective>;
    @ViewChild(DisplayInfoActionDirective) public actionDir: DisplayInfoActionDirective;
    public crs: ComponentRef<BaseDisplayItemComponent>[] = [];

    constructor(
        public cfr: ComponentFactoryResolver,
        public cdr: ChangeDetectorRef,
    ) { }

    private updateCr(cr: ComponentRef<BaseDisplayItemComponent>, item: DisplayItemEntity) {
        cr.instance.config = item.config;
        cr.instance.value = item.value
        cr.instance.rowData = this.config.rowData;
        cr.instance.rowIdx = this.config.rowIdx;
        cr.instance.colIdx = this.config.colIdx;
        cr.instance.processRowData = item.processRowData;

        this._sub.add(
            cr.instance.onEvent.subscribe(r => {
                if (cr.instance.processBodyCellEvent != undefined) {
                    cr.instance.processBodyCellEvent(r, this.config.componentRef || this);
                }
            })
        )
    }

    private initCRs() {
        const dirArr = this.displayItemDirs.toArray();

        for (let i = 0; i < dirArr.length; i++) {
            const item = this.config.displayItems[i];
            const cr = dirArr[i].viewContainerRef.createComponent(
                this.cfr.resolveComponentFactory(item.displayEntity.component),
            )

            this.updateCr(cr, item.displayEntity)
            this.crs.push(cr);
        }

        if (this.config.actionEntity != undefined) {
            const cr = this.actionDir.viewContainerRef.createComponent(
                this.cfr.resolveComponentFactory(this.config.actionEntity.component),
            )
            this.updateCr(cr, this.config.actionEntity);
            this.crs.push(cr);
        }
    }

    public ngOnInit(): void {

    }

    public ngAfterViewInit() {
        this.initCRs();
        this.cdr.detectChanges();
    }

    public ngOnDestroy() {
        this._sub.unsubscribe();
        this.crs.forEach(x => {
            x.destroy()
        })

        this.crs = null;
        this._sub = null;
    }

}
