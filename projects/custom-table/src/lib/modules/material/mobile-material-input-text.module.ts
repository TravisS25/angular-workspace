import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MaterialFilterOptionModule } from './material-filter-option.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { MobileMaterialInputTextComponent } from '../../components/material/mobile-material-input-text/mobile-material-input-text.component';



@NgModule({
    declarations: [
        MobileMaterialInputTextComponent,
    ],
    imports: [
        CommonModule,
        MatInputModule,
        MatFormFieldModule,
        MaterialFilterOptionModule,
        FormsModule,
        ReactiveFormsModule,
        NgxMaskModule.forRoot(),
    ],
    exports: [
        MobileMaterialInputTextComponent
    ]
})
export class MobileMaterialInputTextModule { }
