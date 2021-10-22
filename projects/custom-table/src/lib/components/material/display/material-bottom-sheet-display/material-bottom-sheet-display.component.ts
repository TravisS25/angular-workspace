import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, Directive, EventEmitter, Inject, OnDestroy, OnInit, Output, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { PopupDisplayEntity } from '../../../../table-api';
import { BasePopupFormComponent } from '../../../../components/util/form/base-popup-form/base-popup-form.component'
import { take } from 'rxjs/operators';

@Component({
    selector: 'lib-material-bottom-sheet-display',
    templateUrl: './material-bottom-sheet-display.component.html',
    styleUrls: ['./material-bottom-sheet-display.component.scss']
})
export class MaterialBottomSheetDisplayComponent implements OnInit {
    constructor(
        public cdr: ChangeDetectorRef,
        public cfr: ComponentFactoryResolver,
        public bottomSheetRef: MatBottomSheetRef<any>,
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: PopupDisplayEntity,
    ) {

    }

    public ngOnInit() {

    }
}
