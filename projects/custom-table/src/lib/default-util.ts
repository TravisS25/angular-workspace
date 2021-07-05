import { Type } from '@angular/core';
import { DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { ExportConfig, ExportFormats, APIConfig, Column, RowExpansion, BaseTableConfig, Caption, MultiSelectOptions } from './table-api';
import _ from "lodash" // Import the entire lodash library
import { BaseTableComponent } from './components/base-table/base-table.component';
import { DefaultConsts } from './config';


export interface BaseModalParam {
    component?: Type<any>,
    dialogCfg?: DynamicDialogConfig,
    successSummary?: string,
}

export interface BaseTableButtonParam {
    modal?: BaseModalParam,
    pageURL?: (data: any) => string;
}

export interface ExportFormatOptions {
    exportAPI: (outerData: any) => string;
    fileName: string;
    label: string;
}

export interface ExportFormatsParam {
    csv?: ExportFormatOptions,
    xls?: ExportFormatOptions,
    xlsx?: ExportFormatOptions,
}

export function getDefaultExportConfig(
    param: ExportFormatsParam,
): ExportConfig {
    let exportFormats: ExportFormats = {}

    if (param.csv != undefined) {
        exportFormats.csv = {
            label: param.csv.label,
            fileName: param.csv.fileName,
            icon: 'pi pi-file',
            exportAPI: param.csv.exportAPI,
        }
    }
    if (param.xls != undefined) {
        exportFormats.xls = {
            label: param.xls.label,
            fileName: param.csv.fileName,
            icon: 'pi pi-file-excel',
            exportAPI: param.xls.exportAPI,
        }
    }
    if (param.xlsx != undefined) {
        exportFormats.xlsx = {
            label: param.xlsx.label,
            fileName: param.csv.fileName,
            icon: 'pi pi-file-excel',
            exportAPI: param.xlsx.exportAPI,
        }
    }

    let cfg: ExportConfig = {
        // buttonCfg: {
        //     label: 'Export',
        //     options: {
        //         icon: 'pi pi-chevron-down',
        //         iconPos: 'right',
        //         style: { 'margin-right': '10px' },
        //     },
        // },
        exportFormats: exportFormats,
    }

    return cfg;
}