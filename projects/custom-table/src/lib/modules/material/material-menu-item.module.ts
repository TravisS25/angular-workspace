import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialMenuItemComponent } from '../../components/material/material-menu-item/material-menu-item.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
    declarations: [
        MaterialMenuItemComponent,
    ],
    imports: [
        CommonModule,
        MatMenuModule,
        MatIconModule,
    ],
    exports: [
        MaterialMenuItemComponent
    ]
})
export class MaterialMenuItemModule { }
