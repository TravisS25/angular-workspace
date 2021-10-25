import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayTextComponent } from '../../../components/util/display/display-text/display-text.component';
import { MobileDisplayItemListComponent } from '../../../components/util/display/mobile/mobile-display-item-list/mobile-display-item-list.component';



@NgModule({
    declarations: [
        DisplayTextComponent,
        MobileDisplayItemListComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        DisplayTextComponent,
        MobileDisplayItemListComponent
    ]
})
export class DisplayModule { }
