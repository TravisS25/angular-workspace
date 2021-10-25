import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabPanelDirective } from '../directives/tab-panel.directive';



@NgModule({
    declarations: [
        TabPanelDirective
    ],
    imports: [
        CommonModule
    ],
    exports: [
        TabPanelDirective,
    ]
})
export class TabPanelDirectiveModule { }
