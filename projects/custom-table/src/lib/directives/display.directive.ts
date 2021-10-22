import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[libDisplay]'
})
export class DisplayDirective {

    constructor(public viewContainerRef: ViewContainerRef) { }

}
