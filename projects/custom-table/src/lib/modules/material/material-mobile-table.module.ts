import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialMobileTableComponent } from '../../components/material/material-mobile-table/material-mobile-table.component';
import { MobileTableDirectiveModule } from '../table/mobile/mobile-table-directive.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';



@NgModule({
    declarations: [
        MaterialMobileTableComponent
    ],
    imports: [
        CommonModule,
        MobileTableDirectiveModule,
        MatExpansionModule,
        MatPaginatorModule,
    ],
    exports: [
        MaterialMobileTableComponent
    ]
})
export class MaterialMobileTableModule { }
