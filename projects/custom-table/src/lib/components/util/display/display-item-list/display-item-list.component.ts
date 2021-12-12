import { ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, Input, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { applyDisplayItemSettings } from '../../../table/table-util'
import { BaseDisplayItemComponent } from '../../../table/base-display-item/base-display-item.component';
import { DisplayItemEntity } from '../../../../table-api'
import { TableDisplayItemDirective } from '../../../../directives/table/table-display-item.directive';
import { BaseComponent } from '../../../base/base.component';


// DisplayItemListComponent is util component that allows user to display multiple display
// item components with their own styling
@Component({
    selector: 'lib-display-item-list',
    templateUrl: './display-item-list.component.html',
    styleUrls: ['./display-item-list.component.scss']
})
export class DisplayItemListComponent extends BaseDisplayItemComponent implements OnInit, OnDestroy {
    @Input() public config: DisplayItemEntity[];

    // displayItemDirs are directives that will be dynamically generat display item components
    @ViewChildren(TableDisplayItemDirective) public displayItemDirs: QueryList<TableDisplayItemDirective>;

    // displayItemCrs are component references to display item components
    public displayItemCrs: ComponentRef<BaseDisplayItemComponent>[] = []

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

            applyDisplayItemSettings(cr.instance, this.config[i]);

            cr.instance.outerData = this.outerData;
            cr.instance.componentRef = this;

            if (cr.instance.processDisplayItemEvent != undefined) {
                this._sub.add(
                    cr.instance.onEvent.subscribe(r => {
                        cr.instance.processDisplayItemEvent(r, this);
                    })
                )
            }

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
        super.ngOnDestroy();
        this.displayItemCrs.forEach(x => {
            x.destroy();
        })
        this.displayItemCrs = null;
    }
}
