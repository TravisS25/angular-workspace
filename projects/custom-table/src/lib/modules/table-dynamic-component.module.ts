import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicBodyCellDirective } from '../directives/dynamic-body-cell.directive';
import { DynamicExpansionDirective } from '../directives/dynamic-expansion.directive';
import { DynamicCaptionDirective } from '../directives/dynamic-caption.directive';
import { DynamicColumnFilterDirective } from '../directives/dynamic-column-filter.directive';

@NgModule({
  declarations: [
    DynamicColumnFilterDirective,
    DynamicBodyCellDirective,
    DynamicExpansionDirective,
    DynamicCaptionDirective,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DynamicColumnFilterDirective,
    DynamicBodyCellDirective,
    DynamicExpansionDirective,
    DynamicCaptionDirective,
  ]
})
export class TableDynamicComponentModule { }
