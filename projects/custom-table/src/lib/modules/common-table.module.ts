import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from './primeng/input-text.module'
import { DatePickerModule } from './primeng/date-picker.module';
import { TableModalModule } from './table-modal.module';
import { BoolBodyCellModule } from './bool-body-cell.module';
import { MultipleSelectModule } from './primeng/multiple-select.module';
import { DropdownSelectModule } from './primeng/dropdown-select.module';
import { RowOptionsModule } from './primeng/row-options.module';
import { BaseTabViewModule } from './primeng/base-tab-view.module';
import { CheckboxAllModule } from './primeng/checkbox-all.module';


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
