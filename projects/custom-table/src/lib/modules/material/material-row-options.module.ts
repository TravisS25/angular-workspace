import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MaterialRowOptionsComponent } from '../../components/material/material-row-options/material-row-options.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MaterialMenuItemModule } from './material-menu-item.module';
import { MatRippleModule } from '@angular/material/core';
import { MaterialEllipsisIconModule } from './material-ellipsis-icon.module';


@NgModule({
    declarations: [
        MaterialRowOptionsComponent,
    ],
    imports: [
        CommonModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        MatRippleModule,
        MaterialMenuItemModule,
        MaterialEllipsisIconModule,
    ],
    exports: [
        MaterialRowOptionsComponent,
    ]
})
export class MaterialRowOptionsModule { }
