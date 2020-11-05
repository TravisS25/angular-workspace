import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextComponent } from '../components/filter-components/input-text/input-text.component';
import { InputTextModule as ITM } from 'primeng/inputtext'
import { FilterOptionModule } from './filter-option.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    InputTextComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    FilterOptionModule,
    ITM,
  ],
  exports:[
    InputTextComponent,
  ]
})
export class InputTextModule { }
