import { Component, OnInit, Input, ViewChild, ViewChildren, QueryList, AfterViewInit, ChangeDetectorRef, ComponentFactoryResolver, OnDestroy, ComponentRef, EventEmitter } from '@angular/core';
import { BaseTabViewComponent } from '../../table/base-tab-view/base-tab-view.component';

@Component({
    selector: 'lib-primeng-tab-view',
    templateUrl: './primeng-tab-view.component.html',
    styleUrls: ['./primeng-tab-view.component.scss']
})
export class PrimengTabViewComponent extends BaseTabViewComponent implements OnInit {
    constructor(
        public cdr: ChangeDetectorRef,
        public cfr: ComponentFactoryResolver,
    ) { super(cdr, cfr) }

    public ngOnInit(): void {
        super.ngOnInit();
    }

    public onTabChange(event: any) {
        this.openTab(event.index);
    }
}
