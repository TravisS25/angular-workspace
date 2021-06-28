import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePickerComponent } from '../../components/primeng/date-picker/date-picker.component';
import { CalendarModule } from 'primeng/calendar';
import { FilterOptionModule } from './filter-option.module';
import { FormsModule } from '@angular/forms';


@NgModule({
    declarations: [
        DatePickerComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        CalendarModule,
        FilterOptionModule,
    ],
    exports: [
        DatePickerComponent,
    ]
})
export class DatePickerModule { }
