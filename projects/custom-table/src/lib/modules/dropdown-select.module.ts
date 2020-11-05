import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { DropdownSelectComponent } from '../components/filter-components/dropdown-select/dropdown-select.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    DropdownSelectComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
  ],
  exports: [
    DropdownSelectComponent,
  ]
})
export class DropdownSelectModule { }
