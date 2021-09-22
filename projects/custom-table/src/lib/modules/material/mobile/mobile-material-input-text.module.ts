import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { MobileMaterialInputTextComponent } from '../../../components/material/mobile/mobile-material-input-text/mobile-material-input-text.component';
import { MaterialFilterOptionModule } from '../material-filter-option.module';
import { MaterialInputTextModule } from '../material-input-text.module';



@NgModule({
    declarations: [
        MobileMaterialInputTextComponent,
    ],
    imports: [
        CommonModule,
        MaterialInputTextModule,
    ],
    exports: [
        MobileMaterialInputTextComponent
    ]
})
export class MobileMaterialInputTextModule { }
