import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialFilterOptionComponent } from '../../components/material/material-filter-option/material-filter-option.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
    declarations: [
        MaterialFilterOptionComponent
    ],
    imports: [
        CommonModule,
        MatRadioModule,
        MatMenuModule,
        MatIconModule,
        FormsModule,
    ],
    exports: [
        MaterialFilterOptionComponent
    ]
})
export class MaterialFilterOptionModule { }
