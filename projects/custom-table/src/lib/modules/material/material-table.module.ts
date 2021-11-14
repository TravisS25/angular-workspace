import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialTableComponent } from '../../components/material/material-table/material-table.component';
import { HttpService } from '../../services/http.service';
import { MatTableModule } from '@angular/material/table';
import { TableDirectiveModule } from '../table/table-directive.module';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
    declarations: [
        MaterialTableComponent
    ],
    imports: [
        CommonModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        TableDirectiveModule,
    ],
    exports: [
        MaterialTableComponent
    ],
    providers: [
        HttpService,
    ]
})
export class MaterialTableModule { }
