import { Directive, Input, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[libBaseMobileTable]'
})
export class BaseMobileTableDirective {
    @Input() public rowIdx: number;
    @Input() public rowData: any;

    constructor() { }

}
