import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MaterialDropdownSelectComponent, MatOptionDirective } from '../../components/material/material-dropdown-select/material-dropdown-select.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        MaterialDropdownSelectComponent,
        MatOptionDirective,
    ],
    imports: [
        CommonModule,
        MatSelectModule,
        MatFormFieldModule,
        FormsModule,
    ],
    exports: [
        MaterialDropdownSelectComponent,
        MatOptionDirective,
    ]
})
export class MaterialDropdownSelectModule { }
