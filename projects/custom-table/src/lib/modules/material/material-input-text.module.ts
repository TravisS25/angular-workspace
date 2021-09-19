import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialInputTextComponent } from '../../components/material/material-input-text/material-input-text.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialFilterOptionModule } from './material-filter-option.module';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
    declarations: [
        MaterialInputTextComponent,
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
        MaterialInputTextComponent,
    ]
})
export class MaterialInputTextModule { }
