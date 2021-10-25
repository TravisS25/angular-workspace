import { Directive, ViewContainerRef } from '@angular/core';
import { BaseTableCellDirective } from './base-table-cell.directive';

@Directive({
    selector: '[libTableOutputTemplate]'
})
export class TableOutputTemplateDirective extends BaseTableCellDirective {
    constructor(public viewContainerRef: ViewContainerRef) { super(viewContainerRef) }
}
