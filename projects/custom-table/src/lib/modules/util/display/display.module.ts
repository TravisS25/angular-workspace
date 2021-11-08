import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayTextComponent } from '../../../components/util/display/display-text/display-text.component';
import { DisplayItemListComponent } from '../../../components/util/display/display-item-list/display-item-list.component';



@NgModule({
    declarations: [
        DisplayTextComponent,
        DisplayItemListComponent,
    ],
    imports: [
        CommonModule
    ],
    exports: [
        DisplayTextComponent,
        DisplayItemListComponent,
    ]
})
export class DisplayModule { }
