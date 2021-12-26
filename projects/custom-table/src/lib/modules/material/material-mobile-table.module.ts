import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialMobileTableComponent } from '../../components/material/material-mobile-table/material-mobile-table.component';
import { MobileTableDirectiveModule } from '../table/mobile/mobile-table-directive.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MaterialMobileRowDisplayItemModule } from '../../modules/material/material-mobile-row-display-item.module';
import { HttpService } from '../../services/http.service';



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
        MaterialMobileRowDisplayItemModule
    ],
    exports: [
        MaterialMobileTableComponent
    ],
    providers: [
        HttpService,
    ]
})
export class MaterialMobileTableModule { }
