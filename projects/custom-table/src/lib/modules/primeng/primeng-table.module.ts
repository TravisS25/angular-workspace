import { NgModule } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { DynamicDialogModule, DialogService } from 'primeng/dynamicdialog';
// import { BaseTableComponent } from '../components/base-table/base-table.component';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MultiSelectModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { PrimengTableComponent } from '../../components/primeng/primeng-table/primeng-table.component';
import { TableDirectiveModule } from '../table/table-directive.module';
import { PrimengSortIconComponent } from '../../components/primeng/primeng-sort-icon/primeng-sort-icon.component';



@NgModule({
    declarations: [
        PrimengTableComponent,
        PrimengSortIconComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        TableModule,
        DynamicDialogModule,
        TableDirectiveModule,
        ToastModule,
    ],
    exports: [
        PrimengTableComponent,
    ],
    providers: [
        DialogService,
        MessageService,
    ]
})
export class PrimengTableModule { }
