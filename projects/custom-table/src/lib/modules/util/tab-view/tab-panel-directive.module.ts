import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabPanelHeaderDirective } from '../../../directives/tab-view/tab-panel-header.directive';
import { TabPanelContentDirective } from '../../../directives/tab-view/tab-panel-content.directive';



@NgModule({
    declarations: [
        TabPanelContentDirective,
        TabPanelHeaderDirective,
    ],
    imports: [
        CommonModule
    ],
    exports: [
        TabPanelContentDirective,
        TabPanelHeaderDirective,
    ]
})
export class TabPanelDirectiveModule { }
