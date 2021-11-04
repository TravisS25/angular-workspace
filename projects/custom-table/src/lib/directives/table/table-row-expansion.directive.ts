import { Directive, EventEmitter, Input, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[libTableRowExpansion]'
})
export class TableRowExpansionDirective {
    @Input() public renderCallback: EventEmitter<any>;
    @Input() public outerData: any;

    constructor(public viewContainerRef: ViewContainerRef) { }

}
