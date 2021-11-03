import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabPanelHeaderComponent } from '../../../components/util/tab-view/tab-panel-header/tab-panel-header.component';



@NgModule({
    declarations: [
        TabPanelHeaderComponent,
    ],
    imports: [
        CommonModule
    ],
    exports: [
        TabPanelHeaderComponent
    ]
})
export class TabPanelHeaderModule { }
