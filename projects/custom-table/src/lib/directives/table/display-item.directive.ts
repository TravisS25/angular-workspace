import { Directive, ViewContainerRef } from '@angular/core';
import { BaseTableCellDirective } from '../../directives/table/base-table-cell.directive';

@Directive({
    selector: '[libDisplayItem]'
})
export class DisplayItemDirective extends BaseTableCellDirective {
    constructor(public viewContainerRef: ViewContainerRef) { super(viewContainerRef) }
}
