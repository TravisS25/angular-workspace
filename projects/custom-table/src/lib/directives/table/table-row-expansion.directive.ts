import { Directive, EventEmitter, Input, ViewContainerRef } from '@angular/core';
import { BaseTableRowDirective } from './base-table-row.directive';

@Directive({
    selector: '[libTableRowExpansion]'
})
export class TableRowExpansionDirective extends BaseTableRowDirective {
    constructor(public viewContainerRef: ViewContainerRef) { super(viewContainerRef) }
}
