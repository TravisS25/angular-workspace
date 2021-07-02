import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextOutputTemplateComponent } from '../components/body-cell-components/text-output-template/text-output-template.component';



@NgModule({
    declarations: [
        TextOutputTemplateComponent,
    ],
    imports: [
        CommonModule
    ],
    exports: [
        TextOutputTemplateComponent,
    ]
})
export class TextOutputTemplateModule { }
