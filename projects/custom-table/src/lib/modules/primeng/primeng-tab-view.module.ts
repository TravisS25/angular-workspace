import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimengTabViewComponent } from '../../components/primeng/primeng-tab-view/primeng-tab-view.component';
import { TabViewModule } from 'primeng';
import { TabPanelDirectiveModule } from '../util/tab-view/tab-panel-directive.module';
import { TabPanelHeaderModule } from '../../modules/util/tab-view/tab-panel-header.module';



@NgModule({
    declarations: [
        PrimengTabViewComponent,
    ],
    imports: [
        CommonModule,
        TabViewModule,
        TabPanelHeaderModule,
        TabPanelDirectiveModule,
    ],
    exports: [
        PrimengTabViewComponent,
    ]
})
export class PrimengTabViewModule { }
