import { Directive, ViewContainerRef } from '@angular/core';
import { BaseMobileTableDirective } from './base-mobile-table.directive';

@Directive({
    selector: '[libMobileTableCaption]'
})
export class MobileTableCaptionDirective extends BaseMobileTableDirective {

    constructor(public viewContainerRef: ViewContainerRef) { super() }

}
