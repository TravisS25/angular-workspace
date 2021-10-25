import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseTableCellDirective } from '../../directives/table/base-table-cell.directive';
import { TableBodyCellDirective } from '../../directives/table/table-body-cell.directive';
import { TableCaptionDirective } from '../../directives/table/table-caption.directive';
import { TableCellDirective } from '../../directives/table/table-cell.directive';
import { TableColumnFilterDirective } from '../../directives/table/table-column-filter.directive';
import { TableExpansionDirective } from '../../directives/table/table-expansion.directive';
import { TableInputTemplateDirective } from '../../directives/table/table-input-template.directive';
import { TableOutputTemplateDirective } from '../../directives/table/table-output-template.directive';



@NgModule({
    declarations: [
        BaseTableCellDirective,
        TableBodyCellDirective,
        TableCaptionDirective,
        TableCellDirective,
        TableColumnFilterDirective,
        TableExpansionDirective,
        TableInputTemplateDirective,
        TableOutputTemplateDirective,
    ],
    imports: [
        CommonModule
    ],
    exports: [
        BaseTableCellDirective,
        TableBodyCellDirective,
        TableCaptionDirective,
        TableCellDirective,
        TableColumnFilterDirective,
        TableExpansionDirective,
        TableInputTemplateDirective,
        TableOutputTemplateDirective,
    ]
})
export class TableDirectiveModule { }
