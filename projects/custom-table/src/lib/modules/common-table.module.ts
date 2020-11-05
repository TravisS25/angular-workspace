import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from './input-text.module'
import { DatePickerModule } from './date-picker.module';
import { TableModalModule } from './table-modal.module';
import { BoolBodyCellModule } from './bool-body-cell.module';
import { MultipleSelectModule } from './multiple-select.module';
import { DropdownSelectModule } from './dropdown-select.module';
import { RowOptionsModule } from './row-options.module';
import { BaseTabViewModule } from './base-tab-view.module';
import { CheckboxAllModule } from './checkbox-all.module';


@NgModule({
  declarations: [],
  imports: [],
  exports: [
    MultipleSelectModule,
    DropdownSelectModule,
    DatePickerModule,
    RowOptionsModule,
    InputTextModule,
    TableModalModule,
    BoolBodyCellModule,
    BaseTabViewModule,
    CheckboxAllModule,
    ButtonModule,
  ]
})
export class CommonTableModule { }
