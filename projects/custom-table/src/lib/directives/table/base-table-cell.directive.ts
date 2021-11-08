import { Directive, Input, ViewContainerRef } from '@angular/core';
import { BaseTableRowDirective } from './base-table-row.directive';

@Directive({
    selector: '[libBaseTableCell]'
})
export abstract class BaseTableCellDirective extends BaseTableRowDirective {
    @Input() public colIdx: number;
    @Input() public field: string;


    constructor(public viewContainerRef: ViewContainerRef) { super(viewContainerRef) }
}
