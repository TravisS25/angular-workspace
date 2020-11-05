import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appDynamicCaption]'
})
export class DynamicCaptionDirective {

  constructor(public viewContainerRef: ViewContainerRef) {}

}
