import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialMenuItemComponent } from '../../components/material/material-menu-item/material-menu-item.component';
import { MatMenuModule } from '@angular/material/menu';



@NgModule({
    declarations: [
        MaterialMenuItemComponent,
    ],
    imports: [
        CommonModule,
        MatMenuModule,
    ],
    exports: [
        MaterialMenuItemComponent
    ]
})
export class MaterialMenuItemModule { }
