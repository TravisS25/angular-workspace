import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialMobileTableComponent } from '../../components/material/material-mobile-table/material-mobile-table.component';
import { MobileTableDirectiveModule } from '../table/mobile/mobile-table-directive.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';



@NgModule({
    declarations: [
        MaterialMobileTableComponent
    ],
    imports: [
        CommonModule,
        MatTableModule,
        MobileTableDirectiveModule,
        MatExpansionModule,
        MatPaginatorModule,
    ],
    exports: [
        MaterialMobileTableComponent
    ]
})
export class MaterialMobileTableModule { }
