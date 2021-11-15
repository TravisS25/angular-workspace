import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, Input, OnInit, ViewChild } from '@angular/core';
import { MaterialRowOptionsComponent } from '../material-row-options/material-row-options.component';
import { BaseDisplayItemI, DisplayItemEntity } from '../../../table-api';
import { BaseDisplayItemComponent } from '../../table/base-display-item/base-display-item.component';
import { TableDisplayItemDirective } from '../../../directives/table/table-display-item.directive';
import { setTableEvents } from '../../table/table-util';

// MaterialMobileRowDisplayItemConfig is config for MaterialMobileRowDisplayItemComponent component
export interface MaterialMobileRowDisplayItemConfig {
    // displayItem is entity that will be dynamically generated to display text/icon 
    displayItem: DisplayItemEntity;

    // displayItemBorderClass is css class around dynamically generated component
    displayItemBorderClass?: string;

    // displayItemBorderStyle is style object around dynamically generated component
    displayItemBorderStyle?: Object;

    // rowOptions is settings that will be applied to mat menu
    rowOptions: BaseDisplayItemI;

    // rowOptionsBorderClass is css class around mat menu
    rowOptionsBorderClass?: string;

    // rowOptionsBorderStyle is style object around mat menu
    rowOptionsBorderStyle?: Object;
}

@Component({
    selector: 'lib-material-mobile-row-display-item',
    templateUrl: './material-mobile-row-display-item.component.html',
    styleUrls: ['./material-mobile-row-display-item.component.scss']
})
export class MaterialMobileRowDisplayItemComponent extends BaseDisplayItemComponent implements OnInit {
    // rowOptions represents MaterialRowOptionsComponent component and is referenced to apply settings
    @ViewChild('rowOptions') public rowOptions: MaterialRowOptionsComponent;

    // displayItemDir is directive that will dynamically generate display item
    @ViewChild(TableDisplayItemDirective) public displayItemDir: TableDisplayItemDirective;

    // config is config used for component
    @Input() public config: MaterialMobileRowDisplayItemConfig;

    // displayItemCr represents the component that will be generated from displayItemDir template
    public displayItemCr: ComponentRef<BaseDisplayItemComponent>;

    constructor(
        public cdr: ChangeDetectorRef,
        public cfr: ComponentFactoryResolver,
    ) { super() }

    // initCrs will initialize display item component and set row options settings
    private initCrs() {
        this.rowOptions.config = this.config.rowOptions.config;
        this.rowOptions.componentRef = this.config.rowOptions.componentRef;
        this.rowOptions.value = this.config.rowOptions.value;
        this.rowOptions.processRowData = this.config.rowOptions.processRowData;
        setTableEvents(this.rowOptions, this.config.rowOptions);

        this._sub.add(
            this.rowOptions.onEvent.subscribe(r => {
                if (this.rowOptions.processDisplayItemEvent != undefined) {
                    this.rowOptions.processDisplayItemEvent(r, this);
                }
            })
        )

        this.displayItemCr = this.displayItemDir.viewContainerRef.createComponent(
            this.cfr.resolveComponentFactory(this.config.displayItem.component)
        );
        this.displayItemCr.instance.config = this.config.displayItem.config;
        this.displayItemCr.instance.outerData = this.outerData;
        this.displayItemCr.instance.componentRef = this;
        this.displayItemCr.instance.colIdx = this.colIdx;
        this.displayItemCr.instance.rowIdx = this.rowIdx;
        this.displayItemCr.instance.rowData = this.rowData;
        this.displayItemCr.instance.value = this.value;
        setTableEvents(this.displayItemCr.instance, this.config.displayItem);

        this._sub.add(
            this.displayItemCr.instance.onEvent.subscribe(r => {
                if (this.displayItemCr.instance.processDisplayItemEvent != undefined) {
                    this.displayItemCr.instance.processDisplayItemEvent(r, this);
                }
            })
        )
    }

    public ngOnInit(): void {
    }

    public ngAfterViewInit(): void {
        this.initCrs();
    }

}
