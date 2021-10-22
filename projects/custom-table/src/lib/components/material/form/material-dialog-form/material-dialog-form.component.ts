import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, Directive, EventEmitter, Inject, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BasePopupFormComponent } from '../../../util/form/base-popup-form/base-popup-form.component';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { PopupFormEntity } from '../../../../table-api';

@Component({
    selector: 'lib-material-dialog-form',
    templateUrl: './material-dialog-form.component.html',
    styleUrls: ['./material-dialog-form.component.scss']
})
export class MaterialDialogFormComponent extends BasePopupFormComponent implements OnInit, AfterViewInit {
    constructor(
        public cdr: ChangeDetectorRef,
        public cfr: ComponentFactoryResolver,
        public dialogRef: MatDialogRef<any>,
        @Inject(MAT_DIALOG_DATA) public data: PopupFormEntity,
    ) {
        super(cdr, cfr);
    }

    protected close() {
        this.dialogRef.close();
    }

    protected success() {
        this.dialogRef.close(this.data.successDismiss);
    }

    public ngOnInit(): void {

    }

    public ngAfterViewInit() {
        this.initFormCr(this.data);
    }
}
