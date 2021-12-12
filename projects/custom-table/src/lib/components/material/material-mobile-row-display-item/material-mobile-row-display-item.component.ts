import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MaterialRowOptionsComponent } from '../material-row-options/material-row-options.component';
import { BaseDisplayItemI, DisplayItemEntity, DisplayFormat } from '../../../table-api';
import { BaseDisplayItemComponent } from '../../table/base-display-item/base-display-item.component';
import { TableDisplayItemDirective } from '../../../directives/table/table-display-item.directive';
import { setTableEvents, applyDisplayItemSettings } from '../../table/table-util';

// MaterialMobileRowDisplayItemConfig is config for MaterialMobileRowDisplayItemComponent component
export interface MaterialMobileRowDisplayItemConfig {
    // text takes in rowData and should return string representing current row
    // This will override displayItem if set
    text?: (rowData: any) => string;

    // getTextClass takes in rowData and should return css classes that add styling to text
    getTextClass?: (rowData: any) => string;

    // getTextStyle takes in rowData and should return object containing css styling for text
    getTextStyle?: (rowData: any) => Object;

    // displayItem is entity that will be dynamically generated to display entity
    displayItem?: DisplayItemEntity;

    // displayItemBorderClass is css class around dynamically generated component
    getDisplayItemClass?: (rowData: any) => string;

    // displayItemBorderStyle is style object around dynamically generated component
    getDisplayItemStyle?: (rowData: any) => Object;

    // rowOptions is settings that will be applied to mat menu
    rowOptions?: BaseDisplayItemI;

    // rowOptionsBorderClass is css class around mat menu
    getRowOptionsClass?: (rowData: any) => string;

    // rowOptionsBorderStyle is style object around mat menu
    getRowOptionsStyle?: (rowData: any) => Object;
}

@Component({
    selector: 'lib-material-mobile-row-display-item',
    templateUrl: './material-mobile-row-display-item.component.html',
    styleUrls: ['./material-mobile-row-display-item.component.scss']
})
export class MaterialMobileRowDisplayItemComponent extends BaseDisplayItemComponent implements OnInit {
    // rowOptions represents MaterialRowOptionsComponent component and is referenced to apply settings
    @ViewChild(MaterialRowOptionsComponent) public rowOptions: MaterialRowOptionsComponent;

    // displayItemDir is directive that will dynamically generate display item
    @ViewChildren(TableDisplayItemDirective) public displayItemDir: QueryList<TableDisplayItemDirective>;

    // config is config used for component
    @Input() public config: MaterialMobileRowDisplayItemConfig;

    // displayItemCr represents the component that will be generated from displayItemDir template
    public displayItemCr: ComponentRef<BaseDisplayItemComponent>;

    constructor(
        public cdr: ChangeDetectorRef,
        public cfr: ComponentFactoryResolver,
    ) { super() }

    // initStyles checks to make sure all styling functions are NOT undefined
    // as they are used in template
    private initStyles() {
        if (this.config.getTextClass == undefined) {
            this.config.getTextClass = (): string => {
                return '';
            }
        }
        if (this.config.getTextStyle == undefined) {
            this.config.getTextStyle = (): Object => {
                return {};
            }
        }
        if (this.config.getDisplayItemClass == undefined) {
            this.config.getDisplayItemClass = (): string => {
                return '';
            }
        }
        if (this.config.getDisplayItemStyle == undefined) {
            this.config.getDisplayItemStyle = (): Object => {
                return {};
            }
        }
        if (this.config.getRowOptionsClass == undefined) {
            this.config.getRowOptionsClass = (): string => {
                return '';
            }
        }
        if (this.config.getRowOptionsStyle == undefined) {
            this.config.getRowOptionsStyle = (): Object => {
                return {};
            }
        }
    }

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

        if (this.config.text == undefined && this.config.displayItem != undefined) {
            this.displayItemCr = this.displayItemDir[0].viewContainerRef.createComponent(
                this.cfr.resolveComponentFactory(this.config.displayItem.component)
            );
            applyDisplayItemSettings(this.displayItemCr.instance, this.config.displayItem);

            this._sub.add(
                this.displayItemCr.instance.onEvent.subscribe(r => {
                    if (this.displayItemCr.instance.processDisplayItemEvent != undefined) {
                        this.displayItemCr.instance.processDisplayItemEvent(r, this);
                    }
                })
            )
        }
    }

    public ngOnInit(): void {
        this.initStyles();
    }

    public ngAfterViewInit(): void {
        this.initCrs();
    }

}
