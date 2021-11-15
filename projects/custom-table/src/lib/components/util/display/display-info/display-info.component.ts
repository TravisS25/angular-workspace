import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, Directive, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, QueryList, Type, ViewChild, ViewChildren, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { DisplayItemEntity, DisplayFormat, PopupFormI } from '../../../../table-api';
import { Subscription } from 'rxjs';
import { BaseDisplayItemComponent } from '../../../table/base-display-item/base-display-item.component';
import { ConfigI } from '../../../../table-api';
import { BaseDisplayInfoActionComponent } from '../base-display-info-action/base-display-info-action.component';
import { applyDisplayItemSettings } from '../../../table/table-util';
import { BaseDisplayItemI } from 'projects/custom-table/src/public-api';

// // DisplayInfoEntity is entity used to create dynamic display info action component
// // and apply config settings to component
// export interface DisplayInfoEntity extends DisplayInfoI {
//     component: Type<BaseDisplayInfoActionComponent>;
// }

// // DisplayInfoI is config settings to be set by user when generating component
// export interface DisplayInfoI extends ConfigI {
//     processOnClick?: (event: any, componentRef: any) => void;
// }

// DisplayInfoItem is used to render a header and display item entity with some styling
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

// DisplayInfoConfig is config used in DisplayInfoComponent component
export interface DisplayInfoConfig {
    // componentRef should be a component reference passed to popup display component
    // that can access the component that called current popup display component
    componentRef?: any;

    // rowData is data from current selected row
    rowData?: any;

    // rowIdx is row index of current selected row
    rowIdx?: number;

    // colIdx is column index of current select column
    colIdx?: number;

    // header is header for popup display component
    header?: DisplayFormat;

    // action is dynamic component
    actionSection?: DisplayItemEntity;

    // displayItems are items to be dynamically created for component
    displayItems: DisplayInfoItem[];
}

// DisplayInfoItemDirective is directive used to dynamically generate display items
@Directive({
    selector: '[libDisplayInfoItem]'
})
export class DisplayInfoItemDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}

// DisplayInfoActionDirective is directive used to dynamically generate an action
// section of the display
@Directive({
    selector: '[libDisplayInfoAction]'
})
export class DisplayInfoActionDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}

// DisplayInfoComponent is a generic component to dynamically generate display information
//
// The main purpose of this component is to dynamically generate a details page for any
// type of entity and have an action section for making an update/delete action
@Component({
    selector: 'lib-display-info',
    templateUrl: './display-info.component.html',
    styleUrls: ['./display-info.component.scss']
})
export class DisplayInfoComponent implements OnInit {
    // _sub is used to add generic subscriptions
    private _sub: Subscription = new Subscription();

    // config is config used for component
    @Input() public config: DisplayInfoConfig;

    // displayItemDirs are directives to dynamically generate display item components
    @ViewChildren(DisplayInfoItemDirective) public displayItemDirs: QueryList<DisplayInfoItemDirective>;

    // actionDir is directive to dynamically generate action section of display info
    @ViewChild(DisplayInfoActionDirective) public actionDir: DisplayInfoActionDirective;

    // displayCrs are references to display items
    public displayCrs: ComponentRef<BaseDisplayItemComponent>[] = [];

    //public actionCr: ComponentRef<BaseDisplayItemComponent>;

    constructor(
        public cfr: ComponentFactoryResolver,
        public cdr: ChangeDetectorRef,
    ) { }

    private updateCr(cr: ComponentRef<BaseDisplayItemComponent>, item: BaseDisplayItemI) {
        applyDisplayItemSettings(cr.instance, item);

        if (cr.instance.processDisplayItemEvent != undefined) {
            this._sub.add(
                cr.instance.onEvent.subscribe(r => {
                    cr.instance.processDisplayItemEvent(r, this);
                })
            )
        }

        this.displayCrs.push(cr)
    }

    private initCRs() {
        const dirArr = this.displayItemDirs.toArray();

        for (let i = 0; i < dirArr.length; i++) {
            const item = this.config.displayItems[i];
            const cr = dirArr[i].viewContainerRef.createComponent(
                this.cfr.resolveComponentFactory(item.displayEntity.component),
            )

            this.updateCr(cr, item.displayEntity);
        }

        if (this.config.actionSection != undefined) {
            const cr = this.actionDir.viewContainerRef.createComponent(
                this.cfr.resolveComponentFactory(this.config.actionSection.component),
            )

            this.updateCr(cr, this.config.actionSection);
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
        this.displayCrs.forEach(x => {
            x.destroy()
        })

        this.displayCrs = null;
        this._sub = null;
    }

}
