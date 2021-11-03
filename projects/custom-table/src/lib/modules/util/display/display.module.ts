import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayTextComponent } from '../../../components/util/display/display-text/display-text.component';
import { MobileDisplayItemListComponent } from '../../../components/util/display/mobile/mobile-display-item-list/mobile-display-item-list.component';
import { MobileDisplayTextComponent } from '../../../components/util/display/mobile/mobile-display-text/mobile-display-text.component';
import { DisplayItemListComponent } from '../../../components/util/display/display-item-list/display-item-list.component';
import { BaseDisplayTextComponent } from '../../../components/util/display/base-display-text/base-display-text.component';



@NgModule({
    declarations: [
        BaseDisplayTextComponent,
        DisplayTextComponent,
        MobileDisplayTextComponent,
        DisplayItemListComponent,
        MobileDisplayItemListComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        BaseDisplayTextComponent,
        DisplayTextComponent,
        MobileDisplayTextComponent,
        DisplayItemListComponent,
        MobileDisplayItemListComponent
    ]
})
export class DisplayModule { }
