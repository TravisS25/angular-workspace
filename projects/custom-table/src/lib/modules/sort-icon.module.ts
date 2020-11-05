import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortIconComponent } from '../components/filter-components/sort-icon/sort-icon.component';



@NgModule({
  declarations: [
    SortIconComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SortIconComponent,
  ]
})
export class SortIconModule { }
