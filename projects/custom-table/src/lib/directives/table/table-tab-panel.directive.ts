import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[libTableTabPanel]'
})
export class TableTabPanelDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}
