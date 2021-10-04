import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialTextInputTemplateComponent } from '../../components/material/material-text-input-template/material-text-input-template.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { MaterialFilterOptionModule } from './material-filter-option.module';



@NgModule({
    declarations: [
        MaterialTextInputTemplateComponent
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
        MaterialTextInputTemplateComponent,
    ]
})
export class MaterialTextInputTemplateModule { }
