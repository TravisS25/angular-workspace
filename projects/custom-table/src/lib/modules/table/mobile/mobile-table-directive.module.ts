import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableCaptionDirective } from '../../../directives/table/table-caption.directive';
import { TableRowExpansionDirective } from '../../../directives/table/table-row-expansion.directive';
import { TableDisplayItemDirective } from '../../../directives/table/table-display-item.directive';



@NgModule({
    declarations: [
        TableCaptionDirective,
        TableDisplayItemDirective,
        TableRowExpansionDirective,
    ],
    imports: [
        CommonModule
    ],
    exports: [
        TableCaptionDirective,
        TableDisplayItemDirective,
        TableRowExpansionDirective,
    ]
})
export class MobileTableDirectiveModule { }
