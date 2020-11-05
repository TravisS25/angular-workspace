import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayPanelModule, OverlayPanel } from 'primeng/overlaypanel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { OverlayModule } from '@angular/cdk/overlay';
import { FilterOptionComponent } from '../components/filter-components/filter-option/filter-option.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    FilterOptionComponent,
  ],
  imports: [
    OverlayPanelModule,
    RadioButtonModule,
    CommonModule,
    FormsModule,
    OverlayModule
  ],
  exports: [
    FilterOptionComponent,
  ]
})
export class FilterOptionModule { }
