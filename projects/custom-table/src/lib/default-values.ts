// default values.ts

import { BaseModalConfig, HTTPOptions, APIConfig, Column, FilterData, State, ParamConfig, SelectItem } from './table-api'
import { HttpResponse, HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseTableComponent } from './components/table/base-table/base-table.component';
import { defaultProcessError } from './util';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DatePickerConfig } from './components/primeng/date-picker/date-picker.component';
import { InputTextConfig } from './components/primeng/input-text/input-text.component';
import { MaterialDropdownSelectConfig } from './components/material/material-dropdown-select/material-dropdown-select.component';
import { MaterialDatePickerConfig } from './components/material/material-date-picker/material-date-picker.component';
import { MaterialInputTextConfig } from './components/material/material-input-text/material-input-text.component';
import { TabPanelItem, TabViewConfig, MaskConfig, BasePagination } from './table-api';

export function getDefaultCSRFHeader(csrfToken: string): HttpHeaders {
    return new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Csrf-Token': csrfToken
    });
}

export function getDefaultDynamicDialogCfg(): DynamicDialogConfig {
    return {
        width: '90%',
        closable: true,
        dismissableMask: false,
        data: {},
    }
}

export function getDefaultTabViewConfig(panels: TabPanelItem[]): TabViewConfig {
    return {
        selectedIdx: 0,
        panels: panels,
    }
}

export function getDefaultMaterialPagination(): BasePagination {
    return {
        pageSize: 20,
        pageSizeOptions: [20, 50, 100],
    }
}

export function getDefaultTextMask(): MaskConfig {
    return {
        maskTemplate: '',
        specialCharacters: [],
        patterns: {},
        prefix: '',
        suffix: '',
        thousandSeparator: ' ',
        decimalMarker: '.',
        dropSpecialCharacters: null,
        hiddenInput: null,
        showMaskTyped: null,
        placeHolderCharacter: null,
        shownMaskExpression: null,
        showTemplate: null,
        clearIfNotMatch: null,
        validation: null,
        separatorLimit: null,
        allowNegativeNumbers: null,
        leadZeroDateTime: null
    }
}

export function getDefaultMaterialInputTextConfig(): MaterialInputTextConfig {
    return {
        filterOptions: [
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
        ]
    }
}

export function getDefaultMaterialDateFilterConfig(): MaterialDatePickerConfig {
    return {
        filterOptions: [
            {
                label: 'After',
                value: 'gt'
            },
            {
                label: 'Before',
                value: 'lt'
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
    }
}

export function getDefaultMaterialNumberConfig(): MaterialInputTextConfig {
    const maskCfg = getDefaultTextMask()
    maskCfg.maskTemplate = 'separator.0';
    maskCfg.thousandSeparator = ',';

    return {
        maskCfg: maskCfg,
        filterOptions: [
            {
                label: 'Greater Than',
                value: 'gt'
            },
            {
                label: 'Less Than',
                value: 'lt'
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
                label: 'Null',
                value: 'isnull'
            },
            {
                label: 'Not Null',
                value: 'isnotnull'
            },
        ]
    }
}

export function getDefaultState(): State {
    return {
        take: 20,
        skip: 0,
        filter: {
            logic: 'and',
            filters: [],
        },
        sort: [],
        group: [],
    }
}

export function getDefaultParamConfig(): ParamConfig {
    return {
        take: 'take',
        skip: 'skip',
        filters: 'filters',
        sorts: 'sorts',
        groups: 'groups',
    }
}

export function getDefaultMaterialCurrencyConfig(): MaterialInputTextConfig {
    const maskCfg = getDefaultTextMask()
    maskCfg.maskTemplate = 'separator.2';
    //maskCfg.prefix = '$';
    //maskCfg.suffix = '$';
    maskCfg.thousandSeparator = ',';

    return {
        maskCfg: maskCfg,
        filterOptions: [
            {
                label: 'Greater Than',
                value: 'gt'
            },
            {
                label: 'Less Than',
                value: 'lt'
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
                label: 'Null',
                value: 'isnull'
            },
            {
                label: 'Not Null',
                value: 'isnotnull'
            },
        ]
    }
}

export function getDefaultDateFilterConfig(): DatePickerConfig {
    let cfg: DatePickerConfig = {
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

export function getDefaultMaterialDropdownConfig(): MaterialDropdownSelectConfig {
    let cfg: MaterialDropdownSelectConfig = {
        label: '--Select--',
        multipleSelect: true,
        style: { 'width': '90%' },
    }
    return cfg;
}

export function getBoolList(): SelectItem[] {
    return [
        {
            label: '--Select--',
            value: null,
        },
        {
            label: 'True',
            value: true,
        },
        {
            label: 'False',
            value: false,
        }
    ]
}
