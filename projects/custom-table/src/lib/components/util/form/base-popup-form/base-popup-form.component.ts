import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, Directive, EventEmitter, OnDestroy, OnInit, Output, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { BaseFormComponent } from '../base-form/base-form.component'
import { PopupFormEntity, PopupFormI, ConfigI } from '../../../../table-api';
import { PopupDirective } from '../../../../directives/popup.directive';
import { Subscription } from 'rxjs';

// BasePopupFormComponent should be extended by dialog/popup component
@Component({
    selector: 'lib-base-popup-form',
    templateUrl: './base-popup-form.component.html',
    styleUrls: ['./base-popup-form.component.scss']
})
export abstract class BasePopupFormComponent implements OnInit {
    private _sub: Subscription = new Subscription();

    @Output() public onEvent: EventEmitter<any> = new EventEmitter();

    @ViewChild(PopupDirective) public formDir: PopupDirective;
    public formCr: ComponentRef<PopupFormI>;

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

        if (this.formCr.instance.onSuccess != undefined) {
            this._sub.add(
                this.formCr.instance.onSuccess.subscribe(r => {
                    this.success();
                })
            )
        }

        if (this.formCr.instance.onClose != undefined) {
            this._sub.add(
                this.formCr.instance.onClose.subscribe(r => {
                    this.close();
                })
            )
        }
    }

    public ngOnInit(): void {

    }
}
