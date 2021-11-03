import { ChangeDetectorRef, Component, ComponentFactoryResolver, OnInit, Type } from '@angular/core';
import { BaseComponent } from '../../base/base.component';
import { BaseTabViewComponent } from '../../table/base-tab-view/base-tab-view.component';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
    selector: 'lib-material-tab-view',
    templateUrl: './material-tab-view.component.html',
    styleUrls: ['./material-tab-view.component.scss']
})
export class MaterialTabViewComponent extends BaseTabViewComponent implements OnInit {

    constructor(
        public cdr: ChangeDetectorRef,
        public cfr: ComponentFactoryResolver,
    ) { super(cdr, cfr) }

    public ngOnInit(): void {
        super.ngOnInit();
    }

    public tabChange(event: MatTabChangeEvent) {
        this.openTab(event.index);
    }
}
