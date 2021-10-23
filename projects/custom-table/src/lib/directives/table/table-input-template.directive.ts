import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[libTableInputTemplate]'
})
export class TableInputTemplateDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}
