import { NgModule } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { DynamicDialogModule, DialogService } from 'primeng/dynamicdialog';
// import { BaseTableComponent } from '../components/base-table/base-table.component';
import { CheckboxModule } from 'primeng/checkbox';
import { TableDynamicComponentModule } from '../table-dynamic-component.module';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SortIconModule } from '../sort-icon.module';
import { MenuModule } from 'primeng/menu';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MultiSelectModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { PrimengTableComponent } from '../../components/primeng/primeng-table/primeng-table.component';
import { TableDirectiveModule } from '../table/table-directive.module';



@NgModule({
    declarations: [
        PrimengTableComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        TableModule,
        DynamicDialogModule,
        TableDirectiveModule,
        SortIconModule,
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
