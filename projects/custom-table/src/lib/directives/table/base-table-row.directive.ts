import { Directive, Input, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[libBaseTableRow]'
})
export abstract class BaseTableRowDirective {
    @Input() public rowData: any;
    @Input() public rowIdx: number;

    constructor(public viewContainerRef: ViewContainerRef) { }
}
