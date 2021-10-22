import { Directive, ViewContainerRef } from '@angular/core';
import { BaseMobileTableDirective } from './base-mobile-table.directive';

@Directive({
    selector: '[libMobileTablePanelTitle]'
})
export class MobileTablePanelTitleDirective extends BaseMobileTableDirective {

    constructor(public viewContainerRef: ViewContainerRef) { super() }

}
