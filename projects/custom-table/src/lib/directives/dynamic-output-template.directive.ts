import { Directive, Input, ViewContainerRef } from '@angular/core';
import { DynamicBaseCellDirective } from './dynamic-base-cell.directive';

@Directive({
    selector: '[libDynamicOutputTemplate]'
})
export class DynamicOutputTemplateDirective extends DynamicBaseCellDirective {
    constructor(public viewContainerRef: ViewContainerRef) {
        super(viewContainerRef);
    }
}
