import { Directive, Input, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appDynamicTabPanel]'
})
export class DynamicTabPanelDirective {
  @Input() public tabIdx: number;
  @Input() public rowData: any;

  constructor(public viewContainerRef: ViewContainerRef) { }

}
