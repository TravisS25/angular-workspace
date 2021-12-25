import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { getDefaultCSRFHeader } from '../../../../default-values';
import { FormEvents, PopupFormI } from '../../../../table-api';
import { HttpService } from '../../../../services/http.service';
import { BaseFormEventComponent } from '../base-form-event/base-form-event.component';

// TableFormBuilder is purley to extend FormBuilder so any class that extends
// BaseFormComponent will use this instead of FormBuilder itself in their component as we 
// get import errors when trying to import FormBuilder in extended components when
// working with BaseFormComponent#formGroup variable
export class TableFormBuilder extends FormBuilder { }

export class TableFormGroup extends FormGroup { }

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

    // _sub is used to push any subscriptions used within form
    // to keep track of to destroy when component is destroyed
    protected _sub: Subscription = new Subscription();

    // _httpHeaders is used for adding any type of headers to post/put request
    protected _httpHeaders: HttpHeaders = new HttpHeaders();

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
        this._sub.add(
            this.onError.subscribe(r => {
                if (this.processError != undefined) {
                    this.processError(r, this);
                }
            })
        )

        this._sub.add(
            this.onSuccess.subscribe(r => {
                if (this.processSuccess != undefined) {
                    this.processSuccess(r, this);
                }
            })
        )

        this._sub.add(
            this.onClose.subscribe(r => {
                if (this.processClose != undefined) {
                    this.processClose(this);
                }
            })
        )

        this._sub.add(
            this.onLoadingComplete.subscribe(r => {
                if (this.processLoadingComplete != undefined) {
                    this.processLoadingComplete(this);
                }
            })
        )
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

            this.http.requestJSONResponse(
                request,
                this._apiURL,
                {
                    body: this.formGroup.value,
                    withCredentials: true,
                    observe: 'response',
                    headers: this._httpHeaders,
                    responseType: 'json',
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