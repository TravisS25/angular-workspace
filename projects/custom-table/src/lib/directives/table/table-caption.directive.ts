import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[libTableCaption]'
})
export class TableCaptionDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}
