import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialDisplayActionComponent } from '../../components/material/material-display-action/material-display-action.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
    declarations: [
        MaterialDisplayActionComponent,
    ],
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
    ],
    exports: [
        MaterialDisplayActionComponent,
    ]
})
export class MaterialDisplayActionModule { }
