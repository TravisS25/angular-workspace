import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialFilterOptionComponent } from '../../components/material/material-filter-option/material-filter-option.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MaterialEllipsisIconModule } from './material-ellipsis-icon.module';


@NgModule({
    declarations: [
        MaterialFilterOptionComponent
    ],
    imports: [
        CommonModule,
        MatRadioModule,
        MatMenuModule,
        MatIconModule,
        MatRippleModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialEllipsisIconModule,
    ],
    exports: [
        MaterialFilterOptionComponent
    ]
})
export class MaterialFilterOptionModule { }
