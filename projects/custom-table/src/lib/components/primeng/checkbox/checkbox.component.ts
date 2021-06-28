import { Component, OnInit, ComponentFactoryResolver, ChangeDetectorRef, ViewChild } from '@angular/core';
import { BaseColumnItems, BaseTableEvent, BaseTableEventConfig } from '../../../table-api';

export interface CheckboxEvent {
    colIdx?: number;
    rowIdx?: number;
    rowData?: any;
    checked?: boolean;
    isHeaderCheckbox?: boolean;
}

@Component({
    selector: 'app-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent extends BaseColumnItems implements OnInit {
    public checked: boolean = false;
    public _cbCfg: BaseTableEventConfig;

    constructor() {
        super()
    }

    private initColumnFilterEvent() {
        this._subs.push(
            this.onColumnFilterEvent.subscribe(r => {
                let event = r as BaseTableEvent;
                let cfg = event.eventFieldName as CheckboxEvent

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
            throw ('MUST SET CONFIG FOR CHECKBOX')
        } else {
            this._cbCfg = this.config
        }
    }

    public ngOnInit(): void {
        this.initConfig();
        this.initColumnFilterEvent();
    }

    public onChangeEvent(event: any) {
        //console.log(event);

        let cbe: CheckboxEvent = {
            colIdx: this.colIdx,
            rowIdx: this.rowIdx,
            checked: event.checked,
            rowData: this.rowData,
            isHeaderCheckbox: false,
        }

        let cfg: BaseTableEvent = {
            eventFieldName: this._cbCfg.eventFieldName,
            event: cbe,
        }

        this.onBodyCellEvent.emit(cfg);
    }
}
