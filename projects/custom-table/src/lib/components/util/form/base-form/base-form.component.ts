import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { getDefaultCSRFHeader } from '../../../../default-values';
import { FormEvents } from '../../../../table-api';

@Component({
    selector: 'lib-base-form',
    templateUrl: './base-form.component.html',
    styleUrls: ['./base-form.component.scss']
})
export abstract class BaseFormComponent implements OnInit {
    // _apiURL is the url that will make a GET request and 
    // a POST/PUT request for the form
    protected _apiURL: string;

    // _token should be set when making a GET request for csrf
    protected _token: string;

    // _subs is used to push any subscriptions used within form
    // to keep track of to destroy when component is destroyed
    protected _sub: Subscription = new Subscription();

    // formSubmitted will set when the "onSubmit" function is activated
    // This can be used to display error message in form if this is true
    // and there is an invalid value within form
    public formSubmitted: boolean = false;

    // header should be set to display header in form
    public header: string;

    // formGroup is group used within form
    public formGroup: FormGroup;

    // isCreate should be set based on whether the form is creating 
    // a new entry or not
    public isCreate: boolean = false;

    @Input() public config: any;
    @Output() public onEvent: EventEmitter<any> = new EventEmitter();

    constructor(
        public fb: FormBuilder,
    ) {
        //this.initBeforeSubmit();
    }

    // private initBeforeSubmit() {
    //     this._processBeforeSubmit = (): Promise<boolean> => {
    //         return Promise.resolve(true);
    //     }
    // }

    public ngOnInit(): void {

    }

    public ngOnDestroy() {
        this._sub.unsubscribe();
        this._sub = null;
    }

    public close() {
        this.onEvent.emit(FormEvents.close)
    }

    // public async onSubmit() {
    //     this.formSubmitted = true;

    //     console.log('form submitted');
    //     console.log(this.formGroup);

    //     if (this.formGroup.valid) {
    //         let con: boolean = true;

    //         if (this._processBeforeSubmit != undefined) {
    //             con = await this._processBeforeSubmit()
    //         }

    //         if (con == null || !con) {
    //             console.log("can't continue!!!!")
    //             return
    //         }

    //         let request: string;

    //         if (this.isCreate) {
    //             request = "POST"
    //         } else {
    //             request = "PUT"
    //         }

    //         console.log('right before submit')
    //         console.log(this._apiURL)
    //         console.log(this.formGroup.value)

    //         this.http.request(
    //             request,
    //             this._apiURL,
    //             {
    //                 body: this.formGroup.value,
    //                 withCredentials: true,
    //                 observe: 'response',
    //                 headers: getDefaultCSRFHeader(this._token),
    //                 responseType: this._responseType,
    //             }
    //         ).subscribe(r => {
    //             if (this._processSuccessSubmit != undefined) {
    //                 this._processSuccessSubmit(r);
    //             }

    //             this.onEvent.emit(FormEvents.submitSuccess);
    //         }, (err: HttpErrorResponse) => {
    //             if (this._processErrorSubmit != undefined) {
    //                 this._processErrorSubmit(err);
    //             }

    //             this.onEvent.emit(FormEvents.submitError);
    //         });
    //     } else {
    //         console.log(this.formGroup);
    //     }
    // }
}


// @Component({
//     selector: 'lib-base-form',
//     templateUrl: './base-form.component.html',
//     styleUrls: ['./base-form.component.scss']
// })
// export abstract class BaseFormComponent implements OnInit {
//     // _apiURL is the url that will make a GET request and 
//     // a POST/PUT request for the form
//     protected _apiURL: string;

//     // _token should be set when making a GET request for csrf
//     protected _token: string;

//     // _subs is used to push any subscriptions used within form
//     // to keep track of to destroy when component is destroyed
//     protected _sub: Subscription = new Subscription();

//     // _responseType is expected response type that
//     // we will get from server
//     protected _responseType: any = 'json';

//     // _processBeforeSubmit allows user to process form group before
//     // it is submitted without having to override "onSubmit" function
//     protected _processBeforeSubmit: () => Promise<boolean>;

//     // _processSuccessSubmit allows user to process form group
//     // after successful submission which can be used to do
//     // things like reset form group
//     protected _processSuccessSubmit: (r: HttpResponse<Object>) => void;

//     // _processErrorSubmit allows user to process HttpErrorResponse error
//     protected _processErrorSubmit: (err: HttpErrorResponse) => void;

//     // formSubmitted will set when the "onSubmit" function is activated
//     // This can be used to display error message in form if this is true
//     // and there is an invalid value within form
//     public formSubmitted: boolean = false;

//     // header should be set to display header in form
//     public header: string;

//     // formGroup is group used within form
//     public formGroup: FormGroup;

//     // isCreate should be set based on whether the form is creating 
//     // a new entry or not
//     public isCreate: boolean = false;

//     @Input() public config: any;
//     @Output() public onEvent: EventEmitter<FormEvents> = new EventEmitter();

//     constructor(
//         public fb: FormBuilder,
//         public http: HttpClient,
//     ) {
//         this.initBeforeSubmit();
//     }

//     private initBeforeSubmit() {
//         this._processBeforeSubmit = (): Promise<boolean> => {
//             return Promise.resolve(true);
//         }
//     }

//     public ngOnInit(): void {

//     }

//     public ngOnDestroy() {
//         this._sub.unsubscribe();
//         this._sub = null;
//     }

//     public close() {
//         this.onEvent.emit(FormEvents.close)
//     }

//     public async onSubmit() {
//         this.formSubmitted = true;

//         console.log('form submitted');
//         console.log(this.formGroup);

//         if (this.formGroup.valid) {
//             let con: boolean = true;

//             if (this._processBeforeSubmit != undefined) {
//                 con = await this._processBeforeSubmit()
//             }

//             if (con == null || !con) {
//                 console.log("can't continue!!!!")
//                 return
//             }

//             let request: string;

//             if (this.isCreate) {
//                 request = "POST"
//             } else {
//                 request = "PUT"
//             }

//             console.log('right before submit')
//             console.log(this._apiURL)
//             console.log(this.formGroup.value)

//             this.http.request(
//                 request,
//                 this._apiURL,
//                 {
//                     body: this.formGroup.value,
//                     withCredentials: true,
//                     observe: 'response',
//                     headers: getDefaultCSRFHeader(this._token),
//                     responseType: this._responseType,
//                 }
//             ).subscribe(r => {
//                 if (this._processSuccessSubmit != undefined) {
//                     this._processSuccessSubmit(r);
//                 }

//                 this.onEvent.emit(FormEvents.submitSuccess);
//             }, (err: HttpErrorResponse) => {
//                 if (this._processErrorSubmit != undefined) {
//                     this._processErrorSubmit(err);
//                 }

//                 this.onEvent.emit(FormEvents.submitError);
//             });
//         } else {
//             console.log(this.formGroup);
//         }
//     }
// }
