import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoDisplayComponent } from '../../components/util/display/info-display/info-display.component';



@NgModule({
    declarations: [
        InfoDisplayComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        InfoDisplayComponent
    ]
})
export class InfoDisplayModule { }
