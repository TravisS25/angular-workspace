import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicTabPanelDirective } from '../directives/dynamic-tab-panel.directive';
//import { DynamicTabPanelDirective } from '../../shared-directives/tab-view/dynamic-tab-panel.directive'

@NgModule({
  declarations: [
    DynamicTabPanelDirective,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DynamicTabPanelDirective,
  ]
})
export class DynamicTabViewModule { }
