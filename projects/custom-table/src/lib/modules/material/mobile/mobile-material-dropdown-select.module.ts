import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialDropdownSelectModule } from '../material-dropdown-select.module';
import { MobileMaterialDropdownSelectComponent } from '../../../components/material/mobile/mobile-material-dropdown-select/mobile-material-dropdown-select.component';



@NgModule({
    declarations: [
        MobileMaterialDropdownSelectComponent,
    ],
    imports: [
        CommonModule,
        MaterialDropdownSelectModule,
    ],
    exports: [
        MobileMaterialDropdownSelectComponent
    ]
})
export class MobileMaterialDropdownSelectModule { }
