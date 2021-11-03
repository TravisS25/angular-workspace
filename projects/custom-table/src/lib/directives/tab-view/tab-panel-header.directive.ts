import { Directive, Input, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[libTabPanelHeader]'
})
export class TabPanelHeaderDirective {
    @Input() public tabIdx: number;

    constructor(public viewContainerRef: ViewContainerRef) { }
}
