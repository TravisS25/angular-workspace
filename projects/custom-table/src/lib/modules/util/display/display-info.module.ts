import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    DisplayInfoComponent,
    DisplayInfoItemDirective,
    DisplayInfoActionDirective
} from '../../../components/util/display/display-info/display-info.component';



@NgModule({
    declarations: [
        DisplayInfoComponent,
        DisplayInfoItemDirective,
        DisplayInfoActionDirective,
    ],
    imports: [
        CommonModule
    ],
    exports: [
        DisplayInfoComponent,
        DisplayInfoItemDirective,
        DisplayInfoActionDirective,
    ]
})
export class DisplayInfoModule { }
