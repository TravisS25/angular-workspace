import { Directive, ViewContainerRef, Input } from '@angular/core';

@Directive({
    selector: '[appDynamicBodyCell]'
})
export class DynamicBodyCellDirective {
    @Input() public rowData: any;
    @Input() public colIdx: number;
    @Input() public rowIdx: number;
    @Input() public isInputTemplate: boolean;

    constructor(public viewContainerRef: ViewContainerRef) { }

}
