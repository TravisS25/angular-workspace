import { ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, Input, OnInit, ViewChild } from '@angular/core';
import { DisplayDirective } from '../../../../directives/display.directive';
import { ConfigI, PopupDisplayEntity } from 'projects/custom-table/src/public-api';

@Component({
    selector: 'lib-base-display',
    templateUrl: './base-display.component.html',
    styleUrls: ['./base-display.component.scss']
})
export abstract class BaseDisplayComponent implements OnInit {
    @Input() public config: any;
    @ViewChild(DisplayDirective) public displayDir: DisplayDirective;
    public displayCr: ComponentRef<ConfigI>;

    constructor(
        public cdr: ChangeDetectorRef,
        public cfr: ComponentFactoryResolver,
    ) { }

    protected initDisplayCr(entity: PopupDisplayEntity) {
        this.displayCr = this.displayDir.viewContainerRef.createComponent(
            this.cfr.resolveComponentFactory(entity.component),
        )

        this.displayCr.instance.config = entity.config;
    }

    public ngOnInit(): void {
    }

}
