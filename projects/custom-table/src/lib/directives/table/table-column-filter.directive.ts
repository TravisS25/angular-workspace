import { Directive, Input, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[libTableColumnFilter]'
})
export class TableColumnFilterDirective {
    @Input() colIdx: number;

    constructor(public viewContainerRef: ViewContainerRef) { }
}
