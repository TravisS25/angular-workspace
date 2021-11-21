import { Component, OnInit } from '@angular/core';
import { TableEvents } from '../../../table-api';
import { BaseTableEvent, CheckboxEvent } from '../../../table-api';
import { BaseTableComponent } from '../../table/base-table/base-table.component';
import { BaseColumnFilterComponent } from '../../table/base-column-filter/base-column-filter.component';

export interface MaterialCheckboxConfig {
    color?: any;
    disableRipple?: boolean;
    disabled?: boolean;
    id?: string;
    indeterminate?: boolean;
    labelPosition?: 'left' | 'right',
    name?: string;
    required?: boolean;
    value?: string;
}

@Component({
    selector: 'lib-material-checkbox',
    templateUrl: './material-checkbox.component.html',
    styleUrls: ['./material-checkbox.component.scss']
})
export class MaterialCheckboxComponent extends BaseColumnFilterComponent implements OnInit {
    public checked: boolean = false;
    public cfg: MaterialCheckboxConfig

    constructor() {
        super();
    }

    private initProcessEvents() {
        this.processTableFilterEvent = (event: any, baseTable: BaseTableComponent) => {
            this.checked = false;
        }
        this.processColumnFilterEvent = (e: BaseTableEvent, baseTable: BaseTableComponent) => {
            if (!this.isColumnFilter) {
                const cfg = e.event as CheckboxEvent

                if (cfg.checked) {
                    this.checked = true
                } else {
                    this.checked = false
                }
            }
        }
        this.processTableCellEvent = (e: BaseTableEvent, baseTable: BaseTableComponent) => {
            if (this.isColumnFilter) {
                const cfg = e.event as CheckboxEvent

                if (!cfg.checked) {
                    this.checked = false;
                }
            }
        }
    }

    private initConfig() {
        if (this.config == undefined) {
            throw ('MUST SET MATERIAL CHECKBOX CONFIG')
        } else {
            this.cfg = this.config

            if (this.cfg.name == undefined) {
                this.cfg.name = 'checkbox'
            }

            this.config = this.cfg;
        }
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.initConfig();
        this.initProcessEvents();
    }

    public onChangeEvent(event: any) {
        const cbe: CheckboxEvent = {
            field: this.field,
            colIdx: this.colIdx,
            rowIdx: this.rowIdx,
            rowData: this.rowData,
            checked: event.checked,
            isHeaderCheckbox: false,
        }

        const cfg: BaseTableEvent = {
            eventFieldName: 'checkbox',
            event: cbe,
        }

        this.onEvent.emit(cfg);
    }
}
