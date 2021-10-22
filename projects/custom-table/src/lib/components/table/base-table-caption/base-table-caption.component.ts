import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TableEvents, BaseTableCaptionConfig, SelectItem, Column, BaseTableEvent, ExportType, FilterDescriptor } from '../../../table-api';
import { BaseTableComponent } from '../base-table/base-table.component';

@Component({
    selector: 'lib-base-table-caption',
    templateUrl: './base-table-caption.component.html',
    styleUrls: ['./base-table-caption.component.scss']
})
export abstract class BaseTableCaptionComponent extends BaseTableComponent implements OnInit {
    public config: BaseTableCaptionConfig;

    // _rowMap is used for keeping track of what rows are currently selected
    // to be able to export those selected rows
    protected _rowMap: Map<number, string> = new Map();

    // _selectedColsMap is a map that keeps track of selected columns
    // by field namae to properly show and hide columns
    protected _selectedColsMap: Map<string, boolean> = new Map();

    // selectedColumns is array of values for column dropdown
    public selectedColumns: any[] = [];

    // columnOptions will be the available options to select from dropdown
    // to hide and show columns
    public columnOptions: SelectItem[] = [];

    constructor(
        public router: Router,
    ) {
        super();
    }

    private initConfig() {
        if (this.config == undefined) {
            let cfg: BaseTableCaptionConfig = {
                showRefreshBtn: true,
                showClearFiltersBtn: true,
                showCollapseBtn: true,
                showColumnSelect: true,
                exportCfg: {
                    csvURL: '',
                    xlsURL: '',
                    xlsxURL: '',
                    fileName: '',
                    columnHeadersParam: '',
                    idFilterParam: '',
                }
            }

            this.config = cfg;
        }
    }

    private initColumnFilterSelect() {
        const columns: Column[] = this.baseTable.dt.columns;

        columns.forEach(x => {
            if (x.showColumnOption) {
                this.columnOptions.push({
                    value: x.field,
                    label: x.header,
                });

                if (x.hideColumn) {
                    this._selectedColsMap.set(x.field, false);
                } else {
                    this.selectedColumns.push(x.field);
                    this._selectedColsMap.set(x.field, true);
                }

            }
        })
    }

    public ngOnInit(): void {
        this.initConfig();
        this.initColumnFilterSelect();
    }

    public closeRows() {
        this.baseTable.closeExpandedRows();
        let event: BaseTableEvent = {
            eventType: TableEvents.closeRows
        }
        this.onEvent.emit(event);
    }

    public clearFilters() {
        this.baseTable.clearFilters();
        let event: BaseTableEvent = {
            eventType: TableEvents.clearFilters,
        }
        this.onEvent.emit(event);
    }

    public refresh() {
        this.baseTable.refresh();
        let event: BaseTableEvent = {
            eventType: TableEvents.refresh,
        }
        this.onEvent.emit(event);
    }

    public columnFilterChange(val: string) {
        if (this._selectedColsMap.get(val)) {
            this.baseTable.addHiddenColumn(val);
            this._selectedColsMap.set(val, false);
        } else {
            this.baseTable.removeHiddenColumn(val);
            this._selectedColsMap.set(val, true);
        }

        const event: BaseTableEvent = {
            eventType: TableEvents.columnFilter,
            event: val
        }
        this.onEvent.emit(event);
    }

    public create() {
        if (this.config.createCfg.pageURL != undefined) {
            this.router.navigateByUrl(this.config.createCfg.pageURL(this.baseTable.outerData));
        } else if (this.config.createCfg.modal != undefined) {
            this.config.createCfg.modal(this.baseTable);
        } else if (this.config.createCfg.actionFn != undefined) {
            this.config.createCfg.actionFn(this.baseTable);
        }
    }

    public export(et: ExportType) {
        let url: string;

        switch (et) {
            case ExportType.csv:
                et = ExportType.csv
                url = this.config.exportCfg.csvURL;
                break;
            case ExportType.xls:
                et = ExportType.xls
                url = this.config.exportCfg.xlsURL;
                break;
            case ExportType.xlsx:
                et = ExportType.xlsx
                url = this.config.exportCfg.xlsxURL;
                break;
        }

        const headers: string[] = [];

        this._selectedColsMap.forEach((v, k) => {
            if (v) {
                headers.push(k);
            }
        })

        if (this._rowMap.size == 0) {
            url += this.baseTable.getFilterParams() + '&' + this.config.exportCfg.columnHeadersParam + '=' +
                encodeURI(JSON.stringify(headers));
        } else {
            const ids = [];
            this._rowMap.forEach((v, k) => {
                ids.push(v)
            })

            const filter: FilterDescriptor = {
                field: this.config.exportCfg.idFilterParam,
                operator: 'eq',
                value: ids
            }

            url += '?' + this.config.exportCfg.columnHeadersParam + '=' + encodeURI(JSON.stringify(headers)) + '&' +
                this.baseTable.config.paramConfig.filters + '=' +
                encodeURI(JSON.stringify([filter])) + '&' + this.baseTable.config.paramConfig.sorts + '=' +
                encodeURI(JSON.stringify(this.baseTable.state.sort));
        }

        this.baseTable.exportData(et, url, this.config.exportCfg.fileName);

        const event: BaseTableEvent = {
            eventType: TableEvents.export,
        }
        this.onEvent.emit(event);
    }

}
