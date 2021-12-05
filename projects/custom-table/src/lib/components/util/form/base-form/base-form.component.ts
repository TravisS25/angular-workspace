import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { getDefaultCSRFHeader } from '../../../../default-values';
import { FormEvents, PopupFormI } from '../../../../table-api';
import { HttpService } from '../../../../services/http.service';
import { BaseFormEventComponent } from '../base-form-event/base-form-event.component';

export class TableFormBuilder extends FormBuilder { }

// BaseFormComponent is component form should extend to get basic form functions
@Component({
    selector: 'lib-base-form',
    templateUrl: './base-form.component.html',
    styleUrls: ['./base-form.component.scss']
})
export abstract class BaseFormComponent extends BaseFormEventComponent implements PopupFormI, OnInit {
    // _apiURL is the url that will make a GET request and 
    // a POST/PUT request for the form
    protected _apiURL: string;

    // _token should be set when making a GET request for csrf
    protected _token: string;

    // _subs is used to push any subscriptions used within form
    // to keep track of to destroy when component is destroyed
    protected _sub: Subscription = new Subscription();

    // _responseType is expected response type that we will get from server
    protected _responseType: any = 'json';

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

    constructor(
        public http: HttpService,
    ) {
        super()
    }

    private initSubs() {
        if (this.processError != undefined) {
            this._sub.add(
                this.onError.subscribe(r => {
                    this.processError(r, this);
                })
            )
        }
        if (this.processSuccess != undefined) {
            this._sub.add(
                this.onSuccess.subscribe(r => {
                    this.processSuccess(this);
                })
            )
        }
        if (this.processClose != undefined) {
            this._sub.add(
                this.onClose.subscribe(r => {
                    this.processClose(this);
                })
            )
        }
        if (this.processLoadingComplete != undefined) {
            this._sub.add(
                this.onLoadingComplete.subscribe(r => {
                    this.processLoadingComplete(this);
                })
            )
        }
    }

    public ngOnInit(): void {
        this.initSubs();
    }

    public ngOnDestroy() {
        this._sub.unsubscribe();
        this._sub = null;
    }

    public close() {
        this.onClose.emit();
    }

    public async onSubmit() {
        this.formSubmitted = true;

        console.log('form submitted');
        console.log(this.formGroup);

        if (this.formGroup.valid) {
            let con: boolean = true;

            if (this.processBeforeSubmit != undefined) {
                con = await this.processBeforeSubmit(this.formGroup, this);
            }

            if (con == null || !con) {
                console.log("can't continue!!!!")
                return
            }

            let request: string;

            if (this.isCreate) {
                request = "POST"
            } else {
                request = "PUT"
            }

            console.log('right before submit')
            console.log(this._apiURL)
            console.log(this.formGroup.value)

            this.http.request(
                request,
                this._apiURL,
                {
                    body: this.formGroup.value,
                    withCredentials: true,
                    observe: 'response',
                    headers: getDefaultCSRFHeader(this._token),
                    responseType: this._responseType,
                }
            ).subscribe(r => {
                this.onSuccess.emit(r);
            }, (err: HttpErrorResponse) => {
                this.onError.emit(err);
            });
        } else {
            console.log(this.formGroup);
        }
    }
}