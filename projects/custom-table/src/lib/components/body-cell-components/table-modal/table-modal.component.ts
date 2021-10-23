import { Component, OnInit, Type } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { APIConfig, BaseModalConfig, BaseActionConfig } from '../../../table-api';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { DefaultConsts } from '../../../config';
import { SelectItem } from '../../../table-api';

export interface BaseTableModal {
    // details should return map based on rowData passed that you wish to display
    details: (rowData: any) => SelectItem[]

    // header takes the row data passed and should return a header
    // based on field(s) within header
    header: (rowData: any) => string;

    // type is a placeholder and will be overriden if set manually
    // This will be set by the CrudButtonsComponent
    type?: 'details' | 'delete' | 'update';

    // rowData is row data that will be set by CrudButtonsComponent
    // and will be overwritten if value set
    // This is a place holder
    rowData?: any,

    outerData?: any
}

export interface DeleteTableModal extends BaseTableModal {
    // successCloseResult is used when we successfully deleting a record
    // and is passed to ref to be used by caller for things like
    // success messages
    successCloseResult?: any;

    // actionAPI will be used to make a get and delete request based on
    // rowData passed
    actionAPI: APIConfig;

    // successSummary is the toast message that will be displayed upon
    // successful deletion
    successSummary?: string;
}

export interface ActionTableModal extends DeleteTableModal { }

export interface DynamicDeleteTableModalConfig {
    modalConfig: BaseModalConfig;
    tableModalConfig: DeleteTableModal;
}

export interface DynamicDetailsTableModalConfig {
    modalConfig: BaseModalConfig;
    tableModalConfig: BaseTableModal;
}

export interface DynamicDetailsActionConfig extends BaseActionConfig {
    detailsConfig?: DynamicDetailsTableModalConfig;
}

export interface DynamicDeleteActionConfig extends BaseActionConfig {
    deleteConfig?: DynamicDeleteTableModalConfig;
}


@Component({
    selector: 'app-table-modal',
    templateUrl: './table-modal.component.html',
    styleUrls: ['./table-modal.component.scss']
})
export class TableModalComponent implements OnInit {
    private _token: string;

    constructor(
        public http: HttpClient,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
    ) { }

    public ngOnInit(): void {
        // let baseConfig: BaseDetailsDeleteModal = this.config.data;
        let baseConfig: BaseTableModal = this.config.data.tableModalConfig;

        console.log('config data');
        console.log(this.config.data)

        if (baseConfig.type == 'delete') {
            // let config: DeleteTableModal = this.config.data;
            let config: DeleteTableModal = this.config.data.tableModalConfig;
            this.http.get(
                config.actionAPI.apiURL(config.rowData),
                config.actionAPI.apiOptions as any,
            ).subscribe(r => {
                let temp = r as unknown
                let response = temp as HttpResponse<any>;

                this._token = response.headers.get(DefaultConsts.TokenHeader);

                if (config.actionAPI.processResult != undefined) {
                    config.actionAPI.processResult(r);
                }
            }, (err) => {
                if (config.actionAPI.processError != undefined) {
                    config.actionAPI.processError(err);
                }
            });
        }
    }

    public cancel(event: any) {
        this.ref.close('');
    }

    public delete(event: any) {
        //console.log('delete clicked')
        let config = this.config.data.tableModalConfig as DeleteTableModal;

        if (config.actionAPI.apiOptions.headers == undefined) {
            config.actionAPI.apiOptions.headers = new HttpHeaders();
        }

        let headers = config.actionAPI.apiOptions.headers as HttpHeaders;
        headers = headers.set(DefaultConsts.TokenHeader, this._token);
        config.actionAPI.apiOptions.headers = headers;

        this.http.delete(
            config.actionAPI.apiURL(config.rowData),
            config.actionAPI.apiOptions as any,
        ).subscribe(r => {
            //console.log('subscribe')
            if (config.actionAPI.processResult != undefined) {
                config.actionAPI.processResult(r);
            }

            this.ref.close(config.successCloseResult);
        }, (err: HttpErrorResponse) => {
            console.log(JSON.stringify(err));
            if (config.actionAPI.processError != undefined) {
                config.actionAPI.processError(err);
            }
        });

    }
}