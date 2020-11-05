import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModalComponent } from '../components/body-cell-components/table-modal/table-modal.component';
import { ButtonModule } from 'primeng/button';



@NgModule({
  declarations: [
    TableModalComponent,
  ],
  imports: [
    CommonModule,
    ButtonModule,
  ], 
  exports: [
    TableModalComponent,
  ]
})
export class TableModalModule { }
