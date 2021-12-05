import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialExpandRowComponent } from '../../components/material/material-expand-row/material-expand-row.component';
import { MatIconModule } from '@angular/material/icon';
import { MatRipple, MatRippleModule } from '@angular/material/core';



@NgModule({
    declarations: [
        MaterialExpandRowComponent
    ],
    imports: [
        CommonModule,
        MatIconModule,
        MatRippleModule,
    ],
    exports: [
        MaterialExpandRowComponent
    ]
})
export class MaterialExpandRowModule { }
