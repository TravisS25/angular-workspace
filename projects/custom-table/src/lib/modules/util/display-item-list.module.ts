import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayItemListComponent } from '../../components/util/display/display-item-list/display-item-list.component';
import { DisplayItemModule } from './display-item.module';



@NgModule({
    declarations: [
        DisplayItemListComponent
    ],
    imports: [
        CommonModule,
        DisplayItemModule,
    ],
    exports: [
        DisplayItemListComponent
    ]
})
export class DisplayItemListModule { }
