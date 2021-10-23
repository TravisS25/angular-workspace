import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[libTableColumnFilter]'
})
export class TableColumnFilterDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}
