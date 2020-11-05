import { NgModule } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { DynamicDialogModule, DialogService } from 'primeng/dynamicdialog';
import { BaseTableComponent } from '../components/base-table/base-table.component';
import { TableExpansionComponent } from '../components/body-cell-components/table-expansion/table-expansion.component';
import { CheckboxModule } from 'primeng/checkbox';
import { TableDynamicComponentModule } from './table-dynamic-component.module';
import { ToastModule } from 'primeng/toast';
import { ColumnCheckboxDirective } from '../directives/column-checkbox.directive';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SortIconModule } from './sort-icon.module';
import { MenuModule } from 'primeng/menu';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MultiSelectModule } from 'primeng';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    BaseTableComponent,
    TableExpansionComponent,
    ColumnCheckboxDirective,  
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TableModule,
    ButtonModule,
    MessagesModule,
    CheckboxModule,
    MultiSelectModule,
    DynamicDialogModule,
    TableDynamicComponentModule,
    ToggleButtonModule,
    SortIconModule,
    MenuModule,
    // BlockUIModule,
    ToastModule,
  ],
  exports: [
    BaseTableComponent,
  ],
  providers: [
    DialogService,
    MessageService,
  ]
})
export class BaseTableModule { }
