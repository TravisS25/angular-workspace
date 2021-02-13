import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialDatePickerComponent } from '../../components/filter-components/material-components/material-date-picker/material-date-picker.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MaterialFilterOptionModule } from './material-filter-option.module';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';


@NgModule({
    declarations: [
        MaterialDatePickerComponent,
    ],
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MaterialFilterOptionModule,
        MatButtonModule,
        FormsModule,
    ],
    exports: [
        MaterialDatePickerComponent
    ]
})
export class MaterialDatePickerModule { }
