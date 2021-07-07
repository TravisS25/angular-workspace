import { Directive, ViewContainerRef, Input, EventEmitter } from '@angular/core';

@Directive({
    selector: '[appDynamicExpansion]'
})
export class DynamicExpansionDirective {
    @Input() public renderCallback: EventEmitter<any>;
    @Input() public outerData: any;

    constructor(public viewContainerRef: ViewContainerRef) { }
}
