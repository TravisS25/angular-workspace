import { Directive, Input, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[libDynamicOutputTemplate]'
})
export class DynamicOutputTemplateDirective {
    @Input() public rowData: any;
    @Input() public colIdx: number;
    @Input() public rowIdx: number;
    @Input() public isInputTemplate: boolean;
    @Input() public field: string;

    constructor(public viewContainerRef: ViewContainerRef) { }
}
