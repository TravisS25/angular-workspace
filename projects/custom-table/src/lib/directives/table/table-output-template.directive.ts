import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[libTableOutputTemplate]'
})
export class TableOutputTemplateDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}
