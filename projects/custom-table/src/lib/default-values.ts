import { BaseModalConfig, HTTPOptions, APIConfig, Column, FilterData, ButtonOptions, BaseButton, BaseButtonConfig, MultiSelectOptions } from './table-api'
import { HttpResponse, HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseTableComponent } from './components/base-table/base-table.component';
import { defaultProcessTableResult, defaultProcessError } from './util';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DatePickerConfig } from './components/primeng/date-picker/date-picker.component';
import { InputTextConfig } from './components/primeng/input-text/input-text.component';
import { MaterialDropdownSelectConfig } from './components/material/material-dropdown-select/material-dropdown-select.component';
import { MaterialDatePickerConfig } from './components/material/material-date-picker/material-date-picker.component';
import { MaterialInputTextConfig } from './components/material/material-input-text/material-input-text.component';

export function getDefaultDynamicDialogCfg(): DynamicDialogConfig {
    let cfg: DynamicDialogConfig = {
        width: '90%',
        closable: true,
        dismissableMask: false,
        data: {},
    }
    return cfg;
}

export function getDefaultMaterialTextInputConfig(): MaterialInputTextConfig {
    let cfg: MaterialInputTextConfig = {
        filterOptions: {
            selectedValue: 'contains',
            values: [
                {
                    label: 'Contains',
                    value: 'contains',
                },
                {
                    label: 'Does Not Contain',
                    value: 'doesnotcontain',
                },
                {
                    label: 'Equal',
                    value: 'eq',
                },
                {
                    label: 'Not Equal',
                    value: 'neq',
                },
                {
                    label: 'Begins With',
                    value: 'startswith',
                },
                {
                    label: 'Ends With',
                    value: 'endswith',
                },
                {
                    label: 'Null',
                    value: 'isnull',
                },
                {
                    label: 'Not Null',
                    value: 'isnotnull',
                },
            ],
        }
    }
    return cfg;
}

export function getDefaultMaterialDateFilterConfig(): MaterialDatePickerConfig {
    let cfg: MaterialDatePickerConfig = {
        filterOptions: {
            selectedValue: 'eq',
            values: [
                {
                    label: 'Equal',
                    value: 'eq'
                },
                {
                    label: 'Not Equal',
                    value: 'neq'
                },
                {
                    label: 'After',
                    value: 'gt'
                },
                {
                    label: 'After And Equal',
                    value: 'gte'
                },
                {
                    label: 'Before',
                    value: 'lt'
                },
                {
                    label: 'Before And Equal',
                    value: 'lte'
                },
                {
                    label: 'Null',
                    value: 'isnull'
                },
                {
                    label: 'Not Null',
                    value: 'isnotnull'
                },
            ]
        },
    }
    return cfg;
}

export function getDefaultDateFilterConfig(): DatePickerConfig {
    let cfg: DatePickerConfig = {
        eventFieldName: 'DatePicker',
        filterCfg: {
            type: 'date',
            options: {
                selectedValue: 'eq',
                values: [
                    {
                        label: 'Equal',
                        value: 'eq'
                    },
                    {
                        label: 'Not Equal',
                        value: 'neq'
                    },
                    {
                        label: 'After',
                        value: 'gt'
                    },
                    {
                        label: 'After And Equal',
                        value: 'gte'
                    },
                    {
                        label: 'Before',
                        value: 'lt'
                    },
                    {
                        label: 'Before And Equal',
                        value: 'lte'
                    },
                    {
                        label: 'Null',
                        value: 'isnull'
                    },
                    {
                        label: 'Not Null',
                        value: 'isnotnull'
                    },
                ]
            },
        }
    }

    return cfg;
}

export function getDefaultInputTextConfig(): InputTextConfig {
    let cfg: InputTextConfig = {
        filterCfg: {
            type: 'textInput',
            options: {
                selectedValue: 'contains',
                values: [
                    {
                        label: 'Contains',
                        value: 'contains',
                    },
                    {
                        label: 'Does Not Contain',
                        value: 'doesnotcontain',
                    },
                    {
                        label: 'Equal',
                        value: 'eq',
                    },
                    {
                        label: 'Not Equal',
                        value: 'neq',
                    },
                    {
                        label: 'Begins With',
                        value: 'startswith',
                    },
                    {
                        label: 'Ends With',
                        value: 'endswith',
                    },
                    {
                        label: 'Null',
                        value: 'isnull',
                    },
                    {
                        label: 'Not Null',
                        value: 'isnotnull',
                    },
                ],
            }
        }
    }

    return cfg;
}

export function getDefaultTableAPICfg(): APIConfig {
    let cfg: APIConfig = {
        apiURL: (rowData: any): string => {
            throw ('need to implement apiURL!');
        },
        apiOptions: {
            withCredentials: true,
            observe: 'response',
            headers: new HttpHeaders(),
        },
        processResult: (result: any, baseTable: BaseTableComponent) => {
            defaultProcessTableResult(result, baseTable);
        },
        processError: (err: HttpErrorResponse) => {
            defaultProcessError(err);
        }
    }

    return cfg;
}

export function getDefaultTableSettingsAPICfg(): APIConfig {
    let cfg: APIConfig = {
        apiURL: (rowData: any): string => {
            throw ('need to implement apiURL!');
        },
        apiOptions: {
            withCredentials: true,
            observe: 'response',
        },
        processResult: (result: any, baseTable: BaseTableComponent): any => {

        },
        processError: (err: HttpErrorResponse) => {
            defaultProcessError(err);
        },
    }

    return cfg;
}

export function getDefaultLogTableSettingsAPICfg(): APIConfig {
    let cfg: APIConfig = {
        apiURL: (rowData: any): string => {
            throw ('need to implement apiURL!');
        },
        apiOptions: {
            withCredentials: true,
            observe: 'response',
        },
        processResult: (result: any, baseTable: BaseTableComponent) => {
            console.log('result first')
            console.log(result)
            let r = result as HttpResponse<any>;
            let users = r.body;

            for (let i = 0; i < baseTable.columnFilterCrs.length; i++) {
                if (baseTable.columnFilterCrs[i].instance.field == 'userProfile.id') {
                    baseTable.columnFilterCrs[i].instance.value = users;
                }
            }
        },
        processError: (err: HttpErrorResponse) => {
            defaultProcessError(err);
        }
    }

    return cfg;
}

export function getDefaultColumnSelectOpts(): MultiSelectOptions {
    let cfg: MultiSelectOptions = {
        defaultLabel: 'Columns',
        selectedItemsLabel: 'Columns',
        maxSelectedLabels: 0,
    }
    return cfg;
}

export function getDefaultMaterialDropdownConfig(): MaterialDropdownSelectConfig {
    let cfg: MaterialDropdownSelectConfig = {
        eventFieldName: 'MaterialDropdown',
        label: '--Select--',
        multipleSelect: true,
        style: { 'width': '90%' },
    }
    return cfg;
}
