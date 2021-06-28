import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialFilterOptionComponent } from '../../components/material/material-filter-option/material-filter-option.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';


@NgModule({
    declarations: [
        MaterialFilterOptionComponent
    ],
    imports: [
        CommonModule,
        MatRadioModule,
        MatMenuModule,
        FormsModule,
    ],
    exports: [
        MaterialFilterOptionComponent
    ]
})
export class MaterialFilterOptionModule { }
