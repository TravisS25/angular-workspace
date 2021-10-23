import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[libTableExpansion]'
})
export class TableExpansionDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}
