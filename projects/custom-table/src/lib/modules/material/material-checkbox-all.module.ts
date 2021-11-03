import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialCheckboxComponent } from '../../components/material/material-checkbox/material-checkbox.component'
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        MaterialCheckboxComponent,
    ],
    imports: [
        CommonModule,
        MatCheckboxModule,
        FormsModule,
    ],
    exports: [
        MaterialCheckboxComponent,
    ]
})
export class MaterialCheckboxAllModule { }
