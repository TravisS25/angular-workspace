import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, Directive, EventEmitter, OnDestroy, OnInit, Output, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { BaseFormComponent } from '../base-form/base-form.component'
import { FormEvents } from '../../../../config'
import { PopupFormEntity, BaseTableI } from '../../../../table-api';
import { PopupDirective } from '../../../../directives/popup.directive';


@Component({
    selector: 'lib-base-popup-form',
    templateUrl: './base-popup-form.component.html',
    styleUrls: ['./base-popup-form.component.scss']
})
export abstract class BasePopupFormComponent implements OnInit {
    @Output() public onEvent: EventEmitter<any> = new EventEmitter();

    @ViewChild(PopupDirective) public formDir: PopupDirective;
    public formCr: ComponentRef<BaseTableI>;

    constructor(
        public cdr: ChangeDetectorRef,
        public cfr: ComponentFactoryResolver,
    ) { }

    protected abstract close();
    protected abstract success();

    protected initFormCr(entity: PopupFormEntity) {
        this.formCr = this.formDir.viewContainerRef.createComponent(
            this.cfr.resolveComponentFactory(entity.component),
        )

        this.formCr.instance.config = entity.config;


        // this.formCr.instance.onEvent.subscribe(r => {
        //     if (entity.processEvent != undefined) {
        //         entity.processEvent(r, this);
        //     }

        //     this.onEvent.emit(r)
        // })

    }

    public ngOnInit(): void {

    }
}
