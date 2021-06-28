import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RowOptionsComponent } from '../../components/primeng/row-options/row-options.component';
import { MenuModule } from 'primeng/menu';
import { TieredMenuModule } from 'primeng/tieredmenu';


@NgModule({
    declarations: [
        RowOptionsComponent
    ],
    imports: [
        CommonModule,
        TieredMenuModule,
    ],
    exports: [
        RowOptionsComponent,
    ]
})
export class RowOptionsModule { }
