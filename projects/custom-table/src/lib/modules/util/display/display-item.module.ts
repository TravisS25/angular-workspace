import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayItemComponent } from '../../../components/util/display/display-item/display-item.component';



@NgModule({
    declarations: [
        DisplayItemComponent,
    ],
    imports: [
        CommonModule
    ],
    exports: [
        DisplayItemComponent,
    ]
})
export class DisplayItemModule { }
