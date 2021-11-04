import { Component, OnInit, ComponentFactoryResolver, ChangeDetectorRef, ViewChild } from '@angular/core';
import { BaseTableEvent, BaseTableEventConfig, CheckboxEvent } from '../../../table-api';
import { BaseTableComponent } from '../../table/base-table/base-table.component';
import { BaseColumnComponent } from '../../table/base-column/base-column.component';

@Component({
    selector: 'app-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent extends BaseColumnComponent implements OnInit {
    public checked: boolean = false;
    public _cbCfg: BaseTableEventConfig;

    constructor() {
        super()
    }

    private initProcessEvents() {
        // this.processTableFilterEvent = (event: any, baseTable: BaseTableComponent) => {
        //     this.checked = false;
        // }
        // this.processColumnFilterEvent = (e: BaseTableEvent, baseTable: BaseTableComponent) => {
        //     if (!this.isColumnFilter) {
        //         let cfg = e.event as CheckboxEvent

        //         if (cfg.checked) {
        //             this.checked = true
        //         } else {
        //             this.checked = false
        //         }
        //     }
        // }
        // this.processTableCellEvent = (e: BaseTableEvent, baseTable: BaseTableComponent) => {
        //     if (this.isColumnFilter) {
        //         let cfg = e.event as CheckboxEvent

        //         if (!cfg.checked) {
        //             this.checked = false;
        //         }
        //     }
        // }
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
        this.initProcessEvents();
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
            eventType: this._cbCfg.eventType,
            event: cbe,
        }

        this.onEvent.emit(cfg);
    }
}
