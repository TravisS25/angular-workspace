import { Directive, Input, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[libTabPanelContent]'
})
export class TabPanelContentDirective {
    @Input() public tabIdx: number;

    constructor(public viewContainerRef: ViewContainerRef) { }

}
