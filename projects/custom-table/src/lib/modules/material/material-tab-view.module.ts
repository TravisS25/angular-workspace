import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialTabViewComponent } from '../../components/material/material-tab-view/material-tab-view.component';
import { TabPanelDirectiveModule } from '../util/tab-view/tab-panel-directive.module';
import { MatTabsModule } from '@angular/material/tabs';
import { TabPanelHeaderModule } from '../../modules/util/tab-view/tab-panel-header.module';



@NgModule({
    declarations: [
        MaterialTabViewComponent
    ],
    imports: [
        CommonModule,
        TabPanelDirectiveModule,
        MatTabsModule,
        TabPanelHeaderModule
    ],
    exports: [
        MaterialTabViewComponent
    ]
})
export class MaterialTabViewModule { }
