import { Directive, EventEmitter, Output, ViewContainerRef } from '@angular/core';
import { DynamicBaseCellDirective } from './dynamic-base-cell.directive';

@Directive({
    selector: '[libDynamicInputTemplate]'
})
export class DynamicInputTemplateDirective extends DynamicBaseCellDirective {
    //@Output() public editChange: EventEmitter<any> = new EventEmitter<any>();

    constructor(public viewContainerRef: ViewContainerRef) {
        super(viewContainerRef)
    }
}
