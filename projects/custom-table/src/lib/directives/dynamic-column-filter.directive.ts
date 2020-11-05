import { Directive, ViewContainerRef, Input } from '@angular/core';

@Directive({
  selector: '[appDynamicColumnFilter]'
})
export class DynamicColumnFilterDirective {
  @Input() colIdx: number;

  constructor(public viewContainerRef: ViewContainerRef) {}

}
