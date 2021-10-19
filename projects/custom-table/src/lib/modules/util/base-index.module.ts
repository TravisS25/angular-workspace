import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIndexComponent } from '../../components/util/base-index/base-index.component';



@NgModule({
    declarations: [
        BaseIndexComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        BaseIndexComponent
    ]
})
export class BaseIndexModule { }
