import { NgModule } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { DynamicDialogModule, DialogService } from 'primeng/dynamicdialog';
// import { BaseTableComponent } from '../components/base-table/base-table.component';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MenuModule } from 'primeng/menu';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MultiSelectModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { PrimengTableExpansionComponent } from '../../components/primeng/primeng-table-expansion/primeng-table-expansion.component';



@NgModule({
    declarations: [
        PrimengTableExpansionComponent
    ],
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        MenuModule
    ],
    exports: [
        PrimengTableExpansionComponent
    ]
})
export class PrimengTableExpansionModule { }
