import { Directive, ViewContainerRef } from '@angular/core';
import { BaseTableCellDirective } from './base-table-cell.directive';

@Directive({
    selector: '[libTableBodyCell]'
})
export class TableBodyCellDirective extends BaseTableCellDirective {
    constructor(public viewContainerRef: ViewContainerRef) { super() }
}
