import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, Directive, EventEmitter, Inject, OnDestroy, OnInit, Output, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { PopupFormEntity } from '../../../../table-api';
import { BasePopupFormComponent } from '../../../../components/util/form/base-popup-form/base-popup-form.component'
import { take } from 'rxjs/operators';

// MaterialBottomSheetFormComponent is component used for mobile views to display
// detail information without leaving current page
@Component({
    selector: 'lib-material-bottom-sheet-form',
    templateUrl: './material-bottom-sheet-form.component.html',
    styleUrls: ['./material-bottom-sheet-form.component.scss']
})
export class MaterialBottomSheetFormComponent extends BasePopupFormComponent implements OnInit, AfterViewInit {
    constructor(
        public cdr: ChangeDetectorRef,
        public cfr: ComponentFactoryResolver,
        public bottomSheetRef: MatBottomSheetRef<any>,
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: PopupFormEntity,
    ) {
        super(cdr, cfr);
    }

    protected close() {
        this.bottomSheetRef.dismiss();
    }

    protected success() {
        this.bottomSheetRef.dismiss(this.data.successDismiss);
    }

    public ngOnInit() {

    }

    public ngAfterViewInit() {
        this.initFormCr(this.data);
    }
}
