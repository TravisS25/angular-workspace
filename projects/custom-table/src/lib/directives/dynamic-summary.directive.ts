import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[libDynamicSummary]'
})
export class DynamicSummaryDirective {

    constructor(public viewContainerRef: ViewContainerRef) { }
}
