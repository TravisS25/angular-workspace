import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialTabViewComponent } from '../../components/material/material-tab-view/material-tab-view.component';
import { TabPanelDirectiveModule } from '../util/tab-view/tab-panel-directive.module';
import { MatTabsModule } from '@angular/material/tabs';
import { TabPanelHeaderModule } from '../../modules/util/tab-view/tab-panel-header.module';
import { MaterialTabPanelHeaderComponent } from '../../components/material/material-tab-panel-header/material-tab-panel-header.component';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
    declarations: [
        MaterialTabViewComponent,
        MaterialTabPanelHeaderComponent,
    ],
    imports: [
        CommonModule,
        TabPanelDirectiveModule,
        MatTabsModule,
        MatIconModule,
    ],
    exports: [
        MaterialTabViewComponent,
        MaterialTabPanelHeaderComponent,
    ]
})
export class MaterialTabViewModule { }
