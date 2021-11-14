import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialMobileRowDisplayItemComponent } from '../../components/material/material-mobile-row-display-item/material-mobile-row-display-item.component';
import { MaterialRowOptionsModule } from '../../modules/material/material-row-options.module';

@NgModule({
    declarations: [
        MaterialMobileRowDisplayItemComponent
    ],
    imports: [
        CommonModule,
        MaterialRowOptionsModule,
    ],
    exports: [
        MaterialMobileRowDisplayItemComponent
    ]
})
export class MaterialMobileRowDisplayItemModule { }
