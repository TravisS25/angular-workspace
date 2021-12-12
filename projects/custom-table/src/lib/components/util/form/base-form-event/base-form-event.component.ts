import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PopupFormI } from '../../../../table-api';

@Component({
    selector: 'lib-base-form-event',
    templateUrl: './base-form-event.component.html',
    styleUrls: ['./base-form-event.component.scss']
})
export abstract class BaseFormEventComponent implements OnInit, PopupFormI {
    // config for component that extends this class
    @Input() public config: any;

    // processEvent is function to process any generic event that occurs
    // within form component that extends this class
    @Input() public processEvent: (formRef: any) => void;

    // processError is function that should process any type of error event 
    // within form, such a a bad api call
    @Input() public processError: (err: any, formRef: any) => void;

    // processSuccess is function that should process any type of success event
    // within form, such a successful api call
    @Input() public processSuccess: (formRef: any) => void;

    // processClose is function that should process whenever modal form is closed
    @Input() public processClose: (formRef: any) => void;

    // processLoadingComplete is function that should process when form
    // is done initializing, usually when it's done making its api calls
    @Input() public processLoadingComplete: (formRef: any) => void;

    // processBeforeSubmit is function that should process form before it
    // is submitted to server and is activated after form is considered valid
    //
    // The point of this function is to do extra validation by running
    // a long standing action ie. api call to make sure everything is valid
    // before submitting to server which is why this function requires
    // a Promise to be returned, indicating whether to continue or not
    //
    // There may be scenarios where your local form is valid but you need to
    // check server for other validation before submitting
    @Input() public processBeforeSubmit: (form: FormGroup, formRef: any) => Promise<boolean>;

    // onError will activate whenever an error occurs within form
    @Output() public onError: EventEmitter<any> = new EventEmitter();

    // onSuccess will activate whenever success occurs within form
    @Output() public onSuccess: EventEmitter<any> = new EventEmitter();

    // onClose will activate whenever modal form is closed
    @Output() public onClose: EventEmitter<void> = new EventEmitter();

    // onLoadingComplete will activate whenever form is done initializing,
    // ususally whenever it's done making api calls
    @Output() public onLoadingComplete: EventEmitter<any> = new EventEmitter();

    constructor() { }

    ngOnInit(): void {
    }

}
