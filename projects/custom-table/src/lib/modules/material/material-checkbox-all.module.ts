import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialCheckboxComponent } from '../../components/material/material-checkbox/material-checkbox.component'
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MaterialHeaderCheckboxComponent } from '../../components/material/material-header-checkbox/material-header-checkbox.component';

@NgModule({
    declarations: [
        MaterialCheckboxComponent,
        MaterialHeaderCheckboxComponent,
    ],
    imports: [
        CommonModule,
        MatCheckboxModule,
        FormsModule,
    ],
    exports: [
        MaterialCheckboxComponent,
        MaterialHeaderCheckboxComponent,
    ]
})
export class MaterialCheckboxAllModule { }
