import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicBodyCellDirective } from '../directives/dynamic-body-cell.directive';
import { DynamicExpansionDirective } from '../directives/dynamic-expansion.directive';
import { DynamicCaptionDirective } from '../directives/dynamic-caption.directive';
import { DynamicColumnFilterDirective } from '../directives/dynamic-column-filter.directive';
import { DynamicOutputTemplateDirective } from '../directives/dynamic-output-template.directive';
import { DynamicInputTemplateDirective } from '../directives/dynamic-input-template.directive';
import { DynamicTableCellDirective } from '../directives/dynamic-table-cell.directive'

@NgModule({
    declarations: [
        DynamicColumnFilterDirective,
        DynamicBodyCellDirective,
        DynamicExpansionDirective,
        DynamicCaptionDirective,
        DynamicOutputTemplateDirective,
        DynamicInputTemplateDirective,
        DynamicTableCellDirective,
    ],
    imports: [
        CommonModule
    ],
    exports: [
        DynamicColumnFilterDirective,
        DynamicBodyCellDirective,
        DynamicExpansionDirective,
        DynamicCaptionDirective,
        DynamicOutputTemplateDirective,
        DynamicInputTemplateDirective,
        DynamicTableCellDirective,
    ]
})
export class TableDynamicComponentModule { }
