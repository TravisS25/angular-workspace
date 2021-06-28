import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseTabViewComponent } from '../../components/primeng/base-tab-view/base-tab-view.component';
import { TabViewModule } from 'primeng/tabview';
import { DynamicTabViewModule } from '../dynamic-tab-view.module'


@NgModule({
    declarations: [
        BaseTabViewComponent,
    ],
    imports: [
        CommonModule,
        TabViewModule,
        DynamicTabViewModule,
    ],
    exports: [
        BaseTabViewComponent,
    ]
})
export class BaseTabViewModule { }
