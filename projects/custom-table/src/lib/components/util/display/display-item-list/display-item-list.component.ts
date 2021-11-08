import { ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { BaseDisplayItemComponent, BaseTableEvent, DisplayItemEntity, setTableEvents, TableDisplayItemDirective } from 'projects/custom-table/src/public-api';

@Component({
    selector: 'lib-display-item-list',
    templateUrl: './display-item-list.component.html',
    styleUrls: ['./display-item-list.component.scss']
})
export class DisplayItemListComponent extends BaseDisplayItemComponent implements OnInit {
    @Input() public config: DisplayItemEntity[];
    @ViewChildren(TableDisplayItemDirective) public displayItemDirs: QueryList<TableDisplayItemDirective>;

    public crs: ComponentRef<BaseDisplayItemComponent>[] = []

    constructor(
        public cdr: ChangeDetectorRef,
        public cfr: ComponentFactoryResolver,
    ) { super() }

    private initCRs() {
        const items = this.displayItemDirs.toArray();

        for (let i = 0; i < items.length; i++) {
            const cr = items[i].viewContainerRef.createComponent(
                this.cfr.resolveComponentFactory(
                    this.config[i].component
                )
            )

            cr.instance.rowData = this.rowData;
            cr.instance.rowIdx = this.rowIdx;
            cr.instance.outerData = this.outerData;
            cr.instance.componentRef = this;

            cr.instance.config = this.config[i].config;
            cr.instance.value = this.config[i].value;
            cr.instance.processRowData = this.config[i].processRowData;

            setTableEvents(cr.instance, this.config[i])
            this._sub.add(
                cr.instance.onEvent.subscribe(r => {
                    if (cr.instance.processDisplayItemEvent != undefined) {
                        const bte: BaseTableEvent = {
                            event: r
                        }
                        cr.instance.processDisplayItemEvent(bte, this);
                    }
                })
            )

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
        this.crs.forEach(x => {
            x.destroy();
        })
        this.crs = null;
    }

}
