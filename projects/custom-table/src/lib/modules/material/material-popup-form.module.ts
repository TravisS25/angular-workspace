import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialBottomSheetFormComponent } from '../../components/material/form/material-bottom-sheet-form/material-bottom-sheet-form.component';
import { MaterialDialogFormComponent } from '../../components/material/form/material-dialog-form/material-dialog-form.component';



@NgModule({
    declarations: [
        MaterialDialogFormComponent,
        MaterialBottomSheetFormComponent,
    ],
    imports: [
        CommonModule
    ],
    exports: [
        MaterialDialogFormComponent,
        MaterialBottomSheetFormComponent,
    ]
})
export class MaterialPopupFormModule { }
