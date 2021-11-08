import { Directive, ViewContainerRef } from '@angular/core';
import { BaseTableCellDirective } from 'projects/custom-table/src/public-api';

@Directive({
    selector: '[libTableDisplayItem]'
})
export class TableDisplayItemDirective extends BaseTableCellDirective {
    constructor(public viewContainerRef: ViewContainerRef) { super(viewContainerRef) }
}
