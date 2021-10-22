import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIndexComponent, TableDirective, MobileTableDirective } from '../../components/util/base-index/base-index.component';



@NgModule({
    declarations: [
        BaseIndexComponent,
        TableDirective,
        MobileTableDirective,
    ],
    imports: [
        CommonModule
    ],
    exports: [
        BaseIndexComponent
    ]
})
export class BaseIndexModule { }
