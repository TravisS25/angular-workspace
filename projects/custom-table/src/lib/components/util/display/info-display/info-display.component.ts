import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, Directive, Inject, Input, OnDestroy, OnInit, QueryList, Type, ViewChild, ViewChildren, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { DisplayItemEntity } from '../../../../table-api';
import { Subscription } from 'rxjs';
import { DisplayFormat } from '../../../component-config';
import { DisplayItemComponent } from '../display-item/display-item.component';

export interface InfoDisplayItem {
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

export interface InfoDisplayConfig {
    // componentRef should be a component reference passed to popup display component
    // that can access the component that called current popup display component
    componentRef?: any;

    // rowData is data that should be passed when displaying popup display component
    rowData?: any;

    // header is header for popup display component
    header?: DisplayFormat;

    // action is dynamic component
    actionEntity?: DisplayItemEntity;

    // displayItems are items to be dynamically created for component
    displayItems: InfoDisplayItem[];
}

@Directive({
    selector: '[libInfoDisplayItem]'
})
export class InfoDisplayItemDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}

@Directive({
    selector: '[libInfoDisplayAction]'
})
export class InfoDisplayActionDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}

@Component({
    selector: 'lib-info-display',
    templateUrl: './info-display.component.html',
    styleUrls: ['./info-display.component.scss']
})
export class InfoDisplayComponent implements OnInit {
    private _sub: Subscription = new Subscription();

    @Input() public config: InfoDisplayConfig;

    @ViewChildren(InfoDisplayItemDirective) public displayItemDirs: QueryList<InfoDisplayItemDirective>;
    @ViewChild(InfoDisplayActionDirective) public actionDir: InfoDisplayActionDirective;
    public crs: ComponentRef<DisplayItemComponent>[] = [];

    constructor(
        public cfr: ComponentFactoryResolver,
        public cdr: ChangeDetectorRef,
    ) { }

    private updateCr(cr: ComponentRef<DisplayItemComponent>, item: DisplayItemEntity) {
        cr.instance.config = item.config;
        cr.instance.processRowData = item.processRowData;
        cr.instance.processEvent = item.processEvent;
        cr.instance.rowData = this.config.rowData;

        if (cr.instance.processEvent != undefined) {
            this._sub.add(
                cr.instance.onEvent.subscribe(r => {
                    cr.instance.processEvent(r, this.config.componentRef || this);
                })
            )
        }
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

    // private initCRs() {
    //     this.config.items.forEach(item => {
    //         this.displayItemDirs.forEach(dir => {
    //             if (item.popupItemHeader == dir.popupItemHeader) {
    //                 const cr = dir.viewContainerRef.createComponent(
    //                     this.cfr.resolveComponentFactory(item.popupItem.component),
    //                 )

    //                 cr.instance.config = item.popupItem.config;
    //                 cr.instance.processRowData = item.popupItem.processRowData;
    //                 cr.instance.processEvent = item.popupItem.processEvent;
    //                 cr.instance.rowData = this.config.rowData;
    //                 cr.onDestroy(() => {
    //                     console.log('form item destroyed!');
    //                 })

    //                 if (cr.instance.processEvent != undefined) {
    //                     this._sub.add(
    //                         cr.instance.onEvent.subscribe(r => {
    //                             cr.instance.processEvent(r, this.config.table);
    //                         })
    //                     )
    //                 }

    //                 this.crs.push(cr);
    //             }
    //         })
    //     })
    // }

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
