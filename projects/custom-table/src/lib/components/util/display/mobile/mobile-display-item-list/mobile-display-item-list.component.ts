import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, Input, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { DisplayItemDirective } from '../../../../../directives/table/display-item.directive';
import { MobileDisplayItemEntity } from '../../../../../table-api';
import { BaseDisplayItemComponent } from '../../../../table/base-display-item/base-display-item.component';
import { BaseMobileDisplayItemComponent } from '../../../../table/mobile/base-mobile-display-item/base-mobile-display-item.component';

export interface MobileDisplayItemListConfig {
    // isTitlePanel determines whether current set of display
    // entities are apart of title panel or description panel
    //
    // This will be used to determine which process event to use
    // whenever an event is omitted from display item entity
    isTitlePanel?: boolean;

    // displayEntities are display item components to dynamically generate
    // to display multi display items at once
    displayEntities?: MobileDisplayItemEntity[];
}

@Component({
    selector: 'lib-mobile-display-item-list',
    templateUrl: './mobile-display-item-list.component.html',
    styleUrls: ['./mobile-display-item-list.component.scss']
})
export class MobileDisplayItemListComponent extends BaseMobileDisplayItemComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() public config: MobileDisplayItemListConfig
    @ViewChildren(DisplayItemDirective) public displayItemDirs: QueryList<DisplayItemDirective>;

    public crs: ComponentRef<BaseMobileDisplayItemComponent>[] = []

    constructor(
        public cdr: ChangeDetectorRef,
        public cfr: ComponentFactoryResolver,
    ) { super() }

    private initValues() {
        if (this.config == undefined && this.processRowData == undefined) {
            throw ('MUST SET CONFIG OR PROCESS ROW DATA FOR FORM ITEM COMPONENT!');
        }
        if (this.processRowData != undefined) {
            this.processRowData(this.rowData, this);
        }
    }

    private initCRs() {
        const items = this.displayItemDirs.toArray();

        for (let i = 0; i < items.length; i++) {
            const cr = items[i].viewContainerRef.createComponent(
                this.cfr.resolveComponentFactory(
                    this.config.displayEntities[i].component
                )
            )

            cr.instance.config = this.config.displayEntities[i].config;
            cr.instance.value = this.config.displayEntities[i].value;
            cr.instance.processRowData = this.config.displayEntities[i].processRowData;
            cr.instance.processTitlePanelEvent = this.config.displayEntities[i].processTitlePanelEvent;
            cr.instance.processDescriptionPanelEvent = this.config.displayEntities[i].processDescriptionPanelEvent;

            this._sub.add(
                cr.instance.onEvent.subscribe(r => {
                    if (this.config.isTitlePanel) {
                        if (cr.instance.processTitlePanelEvent != undefined) {
                            cr.instance.processTitlePanelEvent(r, this.componentRef || this);
                        }
                    } else {
                        if (cr.instance.processDescriptionPanelEvent != undefined) {
                            cr.instance.processDescriptionPanelEvent(r, this.componentRef || this);
                        }
                    }
                })
            )

            this.crs.push(cr);
        }
    }

    public ngOnInit(): void {
        this.initValues();
    }

    public ngAfterViewInit() {
        this.initCRs();
        this.cdr.detectChanges();
    }

    public ngOnDestroy() {
        this.crs.forEach(x => {
            x.destroy();
        })
        this.crs = null;
    }
}
