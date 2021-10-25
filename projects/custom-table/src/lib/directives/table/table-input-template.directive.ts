import { Directive, ViewContainerRef } from '@angular/core';
import { BaseTableCellDirective } from './base-table-cell.directive';

@Directive({
    selector: '[libTableInputTemplate]'
})
export class TableInputTemplateDirective extends BaseTableCellDirective {
    constructor(public viewContainerRef: ViewContainerRef) { super(viewContainerRef) }
}
