import { Directive, ElementRef, Input } from '@angular/core';
import { BaseTableCellDirective } from './table/base-table-cell.directive';

@Directive({
    selector: '[libDynamicTableCell]'
})
export class DynamicTableCellDirective extends BaseTableCellDirective {
    @Input() public style: Object;

    constructor(public el: ElementRef) {
        super();
        el.nativeElement.style = this.style
    }

}
