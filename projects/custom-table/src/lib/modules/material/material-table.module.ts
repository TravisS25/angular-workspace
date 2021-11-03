import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialTableComponent } from '../../components/material/material-table/material-table.component';
import { HttpService } from '../../services/http.service';

@NgModule({
    declarations: [
        MaterialTableComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        MaterialTableComponent
    ],
    providers: [
        HttpService,
    ]
})
export class MaterialTableModule { }
