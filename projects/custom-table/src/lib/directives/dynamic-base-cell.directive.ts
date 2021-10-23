import { Directive, Input, ViewContainerRef } from '@angular/core';
import { BaseTableCellDirective } from './table/base-table-cell.directive';

@Directive({
    selector: '[libDynamicBaseCell]'
})
export class DynamicBaseCellDirective extends BaseTableCellDirective {
    constructor(public viewContainerRef: ViewContainerRef) {
        super();
    }
}
