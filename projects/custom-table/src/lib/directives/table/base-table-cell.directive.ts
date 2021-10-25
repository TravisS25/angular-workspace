import { Directive, Input, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[libBaseTableCell]'
})
export class BaseTableCellDirective {
    @Input() public rowData: any;
    @Input() public colIdx: number;
    @Input() public rowIdx: number;
    @Input() public field: string;

    constructor(public viewContainerRef: ViewContainerRef) { }
}
