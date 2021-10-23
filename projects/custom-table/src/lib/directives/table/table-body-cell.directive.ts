import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[libTableBodyCell]'
})
export class TableBodyCellDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}
