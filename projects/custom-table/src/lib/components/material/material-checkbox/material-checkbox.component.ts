import { Component, OnInit } from '@angular/core';
import { BaseTableEvent, BaseTableEventConfig } from '../../../table-api';
import { BaseColumnItems } from '../../../table-api';
import { BaseTableComponent } from '../../base-table/base-table.component';
import { CheckboxEvent } from '../../component-config';

export interface MaterialCheckboxConfig extends BaseTableEventConfig {
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
export class MaterialCheckboxComponent extends BaseColumnItems implements OnInit {
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
                let cfg = e.event as CheckboxEvent

                if (cfg.checked) {
                    this.checked = true
                } else {
                    this.checked = false
                }
            }
        }
        this.processBodyCellEvent = (e: BaseTableEvent, baseTable: BaseTableComponent) => {
            if (this.isColumnFilter) {
                let cfg = e.event as CheckboxEvent

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
        }
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.initConfig();
        this.initProcessEvents();
    }

    public onChangeEvent(event: any) {
        let cbe: CheckboxEvent = {
            colIdx: this.colIdx,
            rowIdx: this.rowIdx,
            rowData: this.rowData,
            checked: event.checked,
            isHeaderCheckbox: false,
        }

        let cfg: BaseTableEvent = {
            eventFieldName: this.cfg.eventFieldName,
            event: cbe,
        }

        this.onEvent.emit(cfg);
    }
}
