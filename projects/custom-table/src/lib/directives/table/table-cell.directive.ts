import { Directive, ViewContainerRef } from '@angular/core';
import { BaseTableCellDirective } from './base-table-cell.directive';

@Directive({
    selector: '[libTableCell]'
})
export class TableCellDirective extends BaseTableCellDirective {
    constructor(public viewContainerRef: ViewContainerRef) { super(viewContainerRef) }
}
