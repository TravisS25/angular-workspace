import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimengTabViewComponent } from '../../components/primeng/primeng-tab-view/primeng-tab-view.component';
import { TabViewModule } from 'primeng';
import { TabPanelDirectiveModule } from '../tab-panel-directive.module';



@NgModule({
    declarations: [
        PrimengTabViewComponent,
    ],
    imports: [
        CommonModule,
        TabViewModule,
        TabPanelDirectiveModule,
    ],
    exports: [
        PrimengTabViewComponent,
    ]
})
export class PrimengTabViewModule { }
