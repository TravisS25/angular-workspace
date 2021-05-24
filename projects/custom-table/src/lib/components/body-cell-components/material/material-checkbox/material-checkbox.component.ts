import { Component, OnInit } from '@angular/core';
import { BaseBodyCellItems, BaseTableEvent, BaseTableEventConfig } from '../../../../table-api';
import { CheckboxEvent } from '../../checkbox/checkbox.component';

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
export class MaterialCheckboxComponent extends BaseBodyCellItems implements OnInit {
    public checked: boolean = false;
    public cfg: MaterialCheckboxConfig

    constructor() {
        super();
    }

    private initColumnFilterEvent() {
        this._subs.push(
            this.onColumnFilterEvent.subscribe(r => {
                let event = r as BaseTableEvent;
                let cfg = event.event as CheckboxEvent

                if (cfg.checked) {
                    this.checked = true
                } else {
                    this.checked = false
                }
            })
        )
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
        this.initColumnFilterEvent();
    }

    public onChangeEvent(event: any) {
        console.log('col idx');
        console.log(this.colIdx);
        console.log('row idx');
        console.log(this.rowIdx)

        let cbe: CheckboxEvent = {
            colIdx: this.colIdx,
            rowIdx: this.rowIdx,
            checked: event.checked,
            rowData: this.rowData,
            isHeaderCheckbox: false,
        }

        let cfg: BaseTableEvent = {
            eventFieldName: this.cfg.eventFieldName,
            event: cbe,
        }

        this.onBodyCellEvent.emit(cfg);
    }
}
