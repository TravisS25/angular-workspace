import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { encodeURIState } from '../../../util';
import { CoreColumn } from '../../../table-api';
import { TableEvents, BaseTableCaptionConfig, SelectItem, BaseTableEvent, ExportType, FilterDescriptor } from '../../../table-api';
import { BaseComponent } from '../../base/base.component';
import { BaseTableComponent } from '../base-table/base-table.component';
import { BaseEventComponent } from '../base-event/base-event.component';

@Component({
    selector: 'lib-base-table-caption',
    templateUrl: './base-table-caption.component.html',
    styleUrls: ['./base-table-caption.component.scss']
})
export abstract class BaseTableCaptionComponent extends BaseEventComponent implements OnInit {
    @Input() public config: BaseTableCaptionConfig;

    // componentRef is reference to table current caption is attached to
    @Input() public componentRef: BaseTableComponent;

    // _idMap is used for keeping track of what rows are currently selected
    // to be able to export those selected rows
    protected _idMap: Map<string, boolean> = new Map();

    // _selectedColsMap is a map that keeps track of selected columns
    // by field name to properly show and hide columns
    protected _selectedColsMap: Map<string, boolean> = new Map();

    // selectedColumns is array of values for column dropdown
    public selectedColumns: any[] = [];

    // columnOptions will be the available options to select from dropdown
    // to hide and show columns
    public columnOptions: SelectItem[] = [];

    constructor() {
        super();
    }

    // initConfig will initialize config if undefined with default values
    private initConfig() {
        if (this.config == undefined) {
            this.config = {
                showRefreshBtn: true,
                showClearFiltersBtn: true,
                showCollapseBtn: true,
                showColumnSelect: true,
                exportConfig: {
                    csvURL: '',
                    xlsURL: '',
                    xlsxURL: '',
                    fileName: '',
                    columnHeadersParam: '',
                    idFilterParam: '',
                }
            }
        }
    }

    // initColumnFilterSelect will loop through componentRef's columns
    // and if the CoreColumn#showColumnOption option is set, we add
    // it our columnsOptions list which can be used to have dropdown
    // list of columns to select to hide or show
    //
    // Also we can set to hide columns on initialization
    private initColumnFilterSelect() {
        const columns: CoreColumn[] = this.componentRef.columns;

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

    // setRowIDs will set _idMap keys with passed arrays of row ids
    public setRowIDs(ids: string[]) {
        ids.forEach(x => {
            this._idMap.set(x, true)
        })
    }

    // clearRowIDs will clear _idMap's contents
    public clearRowIDs() {
        this._idMap.clear();
    }

    // closeRows will close all expand rows
    public closeRows() {
        this.componentRef.closeRows();
        this.onEvent.emit({

        });
    }

    // clearFilters will clear all column filters
    public clearFilters() {
        this.componentRef.clearFilters();
        this._idMap.clear();
        this.onEvent.emit({

        });
    }

    // refresh will make request to server for updated rows and table settings
    public refresh() {
        this.componentRef.refresh();
        this._idMap.clear();
        this.onEvent.emit({

        });
    }

    // columnFilterChange should activate when a column dropdown list is activated
    // It takes the 
    public columnFilterChange(val: string) {
        if (this._selectedColsMap.get(val)) {
            this.componentRef.addHiddenColumn(val);
            this._selectedColsMap.set(val, false);
        } else {
            this.componentRef.removeHiddenColumn(val);
            this._selectedColsMap.set(val, true);
        }

        this.onEvent.emit({
            event: val
        });
    }

    // create will activate the "createAction" function of config
    public create() {
        if (this.config.createAction != undefined) {
            this.config.createAction(this);
        }
    }

    // export takes enum of ExportType, which determines the url/file type we will be requesting
    // from server and applies the current componentRef's state to url
    //
    // If _idMap contains entries, then we will apply those key ids to filter
    public export(et: ExportType) {
        let url: string;

        // Determine url
        switch (et) {
            case ExportType.csv:
                url = this.config.exportConfig.csvURL;
                break;
            case ExportType.xls:
                url = this.config.exportConfig.xlsURL;
                break;
            case ExportType.xlsx:
                url = this.config.exportConfig.xlsxURL;
                break;
        }

        const headers: string[] = [];

        // Loop and find current selected columns to use for headers
        this._selectedColsMap.forEach((v, k) => {
            if (v) {
                headers.push(k);
            }
        })

        // If _idMap does not contain entries, modify url solely based on table state
        //
        // Else loop through _idMap, get keys, and add to list to use for filtering
        if (this._idMap.size == 0) {
            url += encodeURIState(this.componentRef.state, this.componentRef.config.paramConfig) + '&' + this.config.exportConfig.columnHeadersParam + '=' +
                encodeURI(JSON.stringify(headers));
        } else {
            const ids = [];
            this._idMap.forEach((v, k) => {
                ids.push(k)
            })

            const filter: FilterDescriptor = {
                field: this.config.exportConfig.idFilterParam,
                operator: 'eq',
                value: ids
            }

            url += '?' + this.config.exportConfig.columnHeadersParam + '=' + encodeURI(JSON.stringify(headers)) + '&' +
                this.componentRef.config.paramConfig.filters + '=' +
                encodeURI(JSON.stringify([filter])) + '&' + this.componentRef.config.paramConfig.sorts + '=' +
                encodeURI(JSON.stringify(this.componentRef.state.sort));
        }

        this.componentRef.exportData(et, url, this.config.exportConfig.fileName);
        this.onEvent.emit({});
    }

}
