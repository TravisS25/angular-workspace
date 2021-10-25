import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[libDisplayItem]'
})
export class DisplayItemDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}
