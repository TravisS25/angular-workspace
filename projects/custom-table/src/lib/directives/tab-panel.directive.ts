import { Directive, Input, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[libTabPanel]'
})
export class TabPanelDirective {
    @Input() public tabIdx: number;
    @Input() public rowData: any;

    constructor(public viewContainerRef: ViewContainerRef) { }

}
