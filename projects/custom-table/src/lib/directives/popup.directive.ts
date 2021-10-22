import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[libPopup]'
})
export class PopupDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}
