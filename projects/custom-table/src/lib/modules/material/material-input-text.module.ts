import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialInputTextComponent } from '../../components/filter-components/material-components/material-input-text/material-input-text.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; 
import { FormsModule } from '@angular/forms';
import { MaterialFilterOptionModule } from './material-filter-option.module';



@NgModule({
  declarations: [
    MaterialInputTextComponent,
  ],
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MaterialFilterOptionModule,
    FormsModule,
  ],
  exports: [
    MaterialInputTextComponent,
  ]
})
export class MaterialInputTextModule { }
