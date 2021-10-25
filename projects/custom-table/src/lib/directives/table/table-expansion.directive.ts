import { Directive, EventEmitter, Input, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[libTableExpansion]'
})
export class TableExpansionDirective {
    @Input() public renderCallback: EventEmitter<any>;
    @Input() public outerData: any;

    constructor(public viewContainerRef: ViewContainerRef) { }
}
