import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MaterialDropdownSelectComponent } from '../../components/filter-components/material-components/material-dropdown-select/material-dropdown-select.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    MaterialDropdownSelectComponent,
  ],
  imports: [
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
  ],
  exports: [
    MaterialDropdownSelectComponent,
  ]
})
export class MaterialDropdownSelectModule { }
