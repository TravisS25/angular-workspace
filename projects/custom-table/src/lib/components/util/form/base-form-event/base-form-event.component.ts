import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PopupFormI } from '../../../../table-api';

@Component({
    selector: 'lib-base-form-event',
    templateUrl: './base-form-event.component.html',
    styleUrls: ['./base-form-event.component.scss']
})
export abstract class BaseFormEventComponent implements OnInit, PopupFormI {
    @Input() public config: any;
    @Input() public processEvent: (formRef: any) => void;
    @Input() public processError: (err: any, formRef: any) => void;
    @Input() public processSuccess: (formRef: any) => void;
    @Input() public processClose: (formRef: any) => void;
    @Input() public processLoadingComplete: (formRef: any) => void;
    @Input() public processBeforeSubmit: (form: FormGroup, formRef: any) => Promise<boolean>;

    @Output() public onError: EventEmitter<any> = new EventEmitter();
    @Output() public onSuccess: EventEmitter<any> = new EventEmitter();
    @Output() public onClose: EventEmitter<void> = new EventEmitter();
    @Output() public onLoadingComplete: EventEmitter<any> = new EventEmitter();

    constructor() { }

    ngOnInit(): void {
    }

}
