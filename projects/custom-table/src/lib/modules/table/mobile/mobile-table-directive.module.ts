import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableCaptionDirective, TableRowExpansionDirective } from 'projects/custom-table/src/public-api';
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
