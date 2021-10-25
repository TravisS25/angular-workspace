import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayInfoComponent } from '../../../components/util/display/display-info/display-info.component';



@NgModule({
    declarations: [
        DisplayInfoComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        DisplayInfoComponent
    ]
})
export class DisplayInfoModule { }
