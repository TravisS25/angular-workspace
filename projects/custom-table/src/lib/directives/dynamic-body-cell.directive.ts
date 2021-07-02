import { Directive, ViewContainerRef, Input } from '@angular/core';
import { DynamicBaseCellDirective } from './dynamic-base-cell.directive';

@Directive({
    selector: '[appDynamicBodyCell]'
})
export class DynamicBodyCellDirective extends DynamicBaseCellDirective {
    constructor(public viewContainerRef: ViewContainerRef) {
        super(viewContainerRef);
    }
}
