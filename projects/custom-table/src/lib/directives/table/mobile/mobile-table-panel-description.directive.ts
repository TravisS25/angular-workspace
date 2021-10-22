import { Directive, ViewContainerRef } from '@angular/core';
import { BaseMobileTableDirective } from './base-mobile-table.directive';

@Directive({
    selector: '[libMobileTablePanelDescription]'
})
export class MobileTablePanelDescriptionDirective extends BaseMobileTableDirective {

    constructor(public viewContainerRef: ViewContainerRef) { super() }

}
