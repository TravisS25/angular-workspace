import { Directive } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { BaseMobileTableDirective } from './base-mobile-table.directive';

@Directive({
    selector: '[libMobileTablePanelRowExpansion]'
})
export class MobileTablePanelRowExpansionDirective extends BaseMobileTableDirective {
    constructor(public viewContainerRef: MatExpansionPanel) { super() }
}
