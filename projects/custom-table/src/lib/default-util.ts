import { Type } from '@angular/core';
import { DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { CreateActionConfig, ExportConfig, ExportFormats, APIConfig, Column, RowExpansion, BaseTableConfig, Caption, ColumnHeaderConfig, MultiSelectOptions, DataTableConfig } from './table-api';
import { getDefaultCreateNewOpts, getDefaultRefreshBtn, getDefaultToggleColumnsBtn, getDefaultClearFilterBtn, getDefaultDynamicDialogCfg, getDefaultCollapseRowsBtn } from './default-values';
import _ from "lodash" // Import the entire lodash library
import { BaseTableComponent } from './components/base-table/base-table.component';
import { DefaultConsts } from './config';


export interface BaseModalParam{
    component?: Type<any>,
    dialogCfg?: DynamicDialogConfig, 
    successSummary?: string,
}

export interface BaseTableButtonParam{
    modal?: BaseModalParam,
    pageURL?: (data: any) => string;
}

export function getDefaultProcessOnClose(successSummary: string):(result: any, baseTable: BaseTableComponent) => void{
    return (result: any, baseTable: BaseTableComponent): void => {
        if(result == DefaultConsts.SuccessCloseResult){
            baseTable.toast({
                severity: DefaultConsts.SucessSeverity,
                summary: successSummary,
            });
    
           baseTable.refresh();
        }
    }
}

export function getDefaultCreateNewConfig(
    param: BaseTableButtonParam,
): CreateActionConfig{
    let button: CreateActionConfig;
    let dialogCfg: DynamicDialogConfig;

    if(param.pageURL != undefined){
        button = {
            label: DefaultConsts.CreateNewLabel,
            options: getDefaultCreateNewOpts(),
            pageURL: param.pageURL
        }
    } else{
        if(param.modal.dialogCfg != undefined){
            dialogCfg = param.modal.dialogCfg;
        } else{
            dialogCfg = getDefaultDynamicDialogCfg();
        }

        button = {
            label: DefaultConsts.CreateNewLabel,
            options: getDefaultCreateNewOpts(),
            createConfig: {
                component: param.modal.component,
                dialogConfig: dialogCfg,
                processOnClose: getDefaultProcessOnClose(param.modal.successSummary),
            },
        }
    }

    return button;
}

export interface ExportFormatOptions{
    exportAPI: (outerData: any) => string;
    fileName: string;
    label: string;
}

export interface ExportFormatsParam{
    csv?: ExportFormatOptions,
    xls?: ExportFormatOptions,
    xlsx?: ExportFormatOptions,
}

export function getDefaultExportConfig(
    param: ExportFormatsParam,
): ExportConfig{
    let exportFormats: ExportFormats = {}

    if(param.csv != undefined){
        exportFormats.csv = {
        label: param.csv.label,
        fileName: param.csv.fileName,
        icon: 'pi pi-file',
        exportAPI: param.csv.exportAPI,
        }
    }
    if(param.xls != undefined){
        exportFormats.xls = {
        label: param.xls.label,
        fileName: param.csv.fileName,
        icon: 'pi pi-file-excel',
        exportAPI: param.xls.exportAPI,
        }
    }
    if(param.xlsx != undefined){
        exportFormats.xlsx = {
        label: param.xlsx.label,
        fileName: param.csv.fileName,
        icon: 'pi pi-file-excel',
        exportAPI: param.xlsx.exportAPI,
        }
    }

    let cfg: ExportConfig = {
        buttonCfg: {
            label: 'Export',
            options: {
                icon: 'pi pi-chevron-down',
                iconPos: 'right',
                style: {'margin-right': '10px'},
            },
        },
        exportFormats: exportFormats,
    }

    return cfg;
} 

export interface CreateCaptionButtonOptions{
    indexURL?: string;
    successSummary?: string;
    dialogCfg?: DynamicDialogConfig;
}

export interface CreateCaptionButtonParam{
    note?: CreateCaptionButtonOptions
}

export interface BaseTableParam{
    dtConfig?: DataTableConfig;
    tableAPIConfig?: APIConfig;
    tableSettingsAPIConfig?: APIConfig;
    columnSelect?: MultiSelectOptions;
    columns?: Column[];
    exportParam?: ExportFormatsParam;
    createNewBtnParam?: BaseTableButtonParam;
    caption?: Caption;
    rowExpansion?: RowExpansion;
    processColumnFilterEvent?: (event: any, baseTable: BaseTableComponent) => void;
    processBodyCellEvent?: (event: any, baseTable: BaseTableComponent) => void;
    processCaptionEvent?: (event: any, baseTable: BaseTableComponent) => void;
    processTableFilterEvent?: (event: any, baseTable: BaseTableComponent) => void;
    processClearFilterEvent?: (event: any, baseTable: BaseTableComponent) => void;
    outerDataHeader?: (outerData: any) => string;
}
  
export function getDefaultBaseTableConfig(param: BaseTableParam): BaseTableConfig{
    let cfg: BaseTableConfig = {
        dtConfig: param.dtConfig,
        tableAPIConfig: param.tableAPIConfig,
        tableSettingsAPIConfig: param.tableSettingsAPIConfig,
        columnSelect: param.columnSelect,
        columns: param.columns,
        refreshButton: getDefaultRefreshBtn(),
        clearFilterButton: getDefaultClearFilterBtn(),
        collapseRowsButton: getDefaultCollapseRowsBtn(),
        caption: param.caption,
        rowExpansion: param.rowExpansion,
        processColumnFilterEvent: param.processColumnFilterEvent,
        processBodyCellEvent: param.processBodyCellEvent,
        processCaptionEvent: param.processCaptionEvent,
        processTableFilterEvent: param.processTableFilterEvent,
        processClearFilterEvent: param.processClearFilterEvent,
        outerDataHeader: param.outerDataHeader,
    }

    if(param.exportParam != undefined){
        cfg.exportConfig = getDefaultExportConfig(param.exportParam);
    }
    if(param.createNewBtnParam != undefined){
        cfg.createNewConfig = getDefaultCreateNewConfig(param.createNewBtnParam);
    }

    return cfg;
}