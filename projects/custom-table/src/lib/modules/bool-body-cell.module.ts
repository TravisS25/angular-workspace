import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { BoolBodyCellComponent } from 'src/app/table/components/body-cell-components/bool-body-cell/bool-body-cell.component';
import { BoolBodyCellComponent } from '../components/body-cell-components/bool-body-cell/bool-body-cell.component';


@NgModule({
  declarations: [
    BoolBodyCellComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    BoolBodyCellComponent,
  ]
})
export class BoolBodyCellModule { }
