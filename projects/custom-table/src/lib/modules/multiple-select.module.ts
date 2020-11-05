import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiSelectComponent } from '../components/filter-components/multi-select/multi-select.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    MultiSelectComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MultiSelectModule,
  ],
  exports: [
    MultiSelectComponent,
  ]
})
export class MultipleSelectModule { }
