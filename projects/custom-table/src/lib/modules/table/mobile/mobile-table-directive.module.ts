import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MobileTableExpansionDirective } from '../../../directives/table/mobile/mobile-table-expansion.directive';
import { MobileTableCaptionDirective } from '../../../directives/table/mobile/mobile-table-caption.directive';
import { MobileTablePanelTitleDirective } from '../../../directives/table/mobile/mobile-table-panel-title.directive';
import { MobileTablePanelDescriptionDirective } from '../../../directives/table/mobile/mobile-table-panel-description.directive';
import { MobileTablePanelRowExpansionDirective } from '../../../directives/table/mobile/mobile-table-panel-row-expansion.directive';



@NgModule({
    declarations: [
        MobileTableExpansionDirective,
        MobileTableCaptionDirective,
        MobileTablePanelTitleDirective,
        MobileTablePanelDescriptionDirective,
        MobileTablePanelRowExpansionDirective,
    ],
    imports: [
        CommonModule
    ],
    exports: [
        MobileTableExpansionDirective,
        MobileTableCaptionDirective,
        MobileTablePanelTitleDirective,
        MobileTablePanelDescriptionDirective,
        MobileTablePanelRowExpansionDirective,
    ]
})
export class MobileTableDirectiveModule { }
