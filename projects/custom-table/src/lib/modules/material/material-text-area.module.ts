import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialTextAreaComponent } from '../../components/material/material-text-area/material-text-area.component';
import { MaterialTextInputTemplateModule } from './material-text-input-template.module';



@NgModule({
    declarations: [
        MaterialTextAreaComponent,
    ],
    imports: [
        CommonModule,
        MaterialTextInputTemplateModule,
    ],
    exports: [
        MaterialTextAreaComponent,
    ]
})
export class MaterialTextAreaModule { }
