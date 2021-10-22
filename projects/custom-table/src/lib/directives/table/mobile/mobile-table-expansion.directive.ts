import { Directive, ViewContainerRef } from '@angular/core';
import { BaseMobileTableDirective } from './base-mobile-table.directive';

@Directive({
    selector: '[libMobileTableExpansion]'
})
export class MobileTableExpansionDirective extends BaseMobileTableDirective {

    constructor(public viewContainerRef: ViewContainerRef) { super() }

}
