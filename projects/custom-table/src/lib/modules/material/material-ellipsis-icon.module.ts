import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialEllipsisIconComponent } from '../../components/material/material-ellipsis-icon/material-ellipsis-icon.component';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';



@NgModule({
    declarations: [
        MaterialEllipsisIconComponent,
    ],
    imports: [
        CommonModule,
        MatIconModule,
        MatRippleModule,
    ],
    exports: [
        MaterialEllipsisIconComponent
    ]
})
export class MaterialEllipsisIconModule { }
