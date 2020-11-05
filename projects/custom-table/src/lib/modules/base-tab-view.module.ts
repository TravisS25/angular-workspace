import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseTabViewComponent } from '../components/body-cell-components/base-tab-view/base-tab-view.component';
import { TabViewModule } from 'primeng/tabview';
import { DynamicTabViewModule } from '../modules/dynamic-tab-view.module'


@NgModule({
  declarations: [
    BaseTabViewComponent,
  ],
  imports: [
    CommonModule,
    TabViewModule,
    DynamicTabViewModule,
  ],
  exports: [
    BaseTabViewComponent,
  ]
})
export class BaseTabViewModule { }
