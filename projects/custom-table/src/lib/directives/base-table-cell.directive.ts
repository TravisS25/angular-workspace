import { Directive, Input, ViewContainerRef } from '@angular/core';
import { DynamicBaseCellDirective } from './dynamic-base-cell.directive';

@Directive({
    selector: '[libBaseTableCell]'
})
export class BaseTableCellDirective {
    @Input() public rowData: any;
    @Input() public colIdx: number;
    @Input() public rowIdx: number;
    @Input() public field: string;

    constructor() { }
}
