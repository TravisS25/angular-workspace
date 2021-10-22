import { Directive, ViewContainerRef } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { BaseMobileTableDirective } from './base-mobile-table.directive';

@Directive({
    selector: '[libMobileTableExpansionPanel]'
})
export class MobileTableExpansionPanelDirective extends BaseMobileTableDirective {
    constructor(public viewContainerRef: MatExpansionPanel) { super() }
}
