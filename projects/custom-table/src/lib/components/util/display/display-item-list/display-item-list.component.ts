import { ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { setTableEvents } from '../../../table/table-util'
import { BaseDisplayItemComponent } from '../../../table/base-display-item/base-display-item.component';
import { BaseComponentEntity } from '../../../../table-api'
import { TableDisplayItemDirective } from '../../../../directives/table/table-display-item.directive';
import { BaseComponent } from '../../../base/base.component';


// DisplayItemListComponent is util component that allows user to display multiple display
// item components with their own styling
@Component({
    selector: 'lib-display-item-list',
    templateUrl: './display-item-list.component.html',
    styleUrls: ['./display-item-list.component.scss']
})
export class DisplayItemListComponent extends BaseDisplayItemComponent implements OnInit {
    @Input() public config: BaseComponentEntity[];

    // displayItemDirs are directives that will be dynamically generat display item components
    @ViewChildren(TableDisplayItemDirective) public displayItemDirs: QueryList<TableDisplayItemDirective>;

    // displayItemCrs are component references to display item components
    public displayItemCrs: ComponentRef<BaseComponent>[] = []

    constructor(
        public cdr: ChangeDetectorRef,
        public cfr: ComponentFactoryResolver,
    ) { super() }

    // initCRs initializes all display item components
    private initCRs() {
        const items = this.displayItemDirs.toArray();

        for (let i = 0; i < items.length; i++) {
            const cr = items[i].viewContainerRef.createComponent(
                this.cfr.resolveComponentFactory(this.config[i].component)
            )

            cr.instance.outerData = this.outerData;
            cr.instance.componentRef = this;

            cr.instance.config = this.config[i].config;
            cr.instance.value = this.config[i].value;
            cr.instance.processEvent = this.config[i].processEvent;

            this._sub.add(
                cr.instance.onEvent.subscribe(r => {
                    if (cr.instance.processEvent != undefined) {
                        cr.instance.processEvent({ event: r }, this);
                    }
                })
            )

            this.displayItemCrs.push(cr);
        }
    }

    public ngOnInit(): void {

    }

    public ngAfterViewInit() {
        this.initCRs();
        this.cdr.detectChanges();
    }

    public ngOnDestroy() {
        this.displayItemCrs.forEach(x => {
            x.destroy();
        })
        this.displayItemCrs = null;
    }
}
