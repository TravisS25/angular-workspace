import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { CheckboxComponent } from '../components/body-cell-components/checkbox/checkbox.component';
import { HeaderCheckboxComponent } from '../components/filter-components/header-checkbox/header-checkbox.component';
import { FormsModule } from '@angular/forms';



@NgModule({
    declarations: [
        CheckboxComponent,
        HeaderCheckboxComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        CheckboxModule,
    ],
    exports: [
        CheckboxComponent,
        HeaderCheckboxComponent,
    ]
})
export class CheckboxAllModule { }
