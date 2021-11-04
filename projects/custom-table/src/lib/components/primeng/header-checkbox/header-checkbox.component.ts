import { Component, OnInit, ComponentFactoryResolver, ChangeDetectorRef, ViewChild, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Checkbox } from 'primeng/checkbox';
import { CheckboxEvent, BaseTableEvent, BaseTableEventConfig } from '../../../table-api';
import { BaseTableComponent } from '../../table/base-table/base-table.component';
import { BaseColumnComponent } from '../../table/base-column/base-column.component';

@Component({
    selector: 'app-header-checkbox',
    templateUrl: './header-checkbox.component.html',
    styleUrls: ['./header-checkbox.component.scss']
})
export class HeaderCheckboxComponent extends BaseColumnComponent implements OnInit, OnDestroy {
    public checked: boolean = false;
    private _hcbCfg: BaseTableEventConfig

    constructor(
        public cfr: ComponentFactoryResolver,
        public cdr: ChangeDetectorRef,
    ) {
        super();
    }

    private initConfig() {
        if (this.config == undefined) {
            throw ('MUST SET CONFIG FOR HEADER CHECKBOX');
        } else {
            this._hcbCfg = this.config;
        }

        this.excludeFilter = true;
    }

    private initProcessEvents() {
        // this.processTableFilterEvent = (event: any, baseTable: BaseTableComponent) => {
        //     this.checked = false
        // }
        // this.processTableCellEvent = (event: BaseTableEvent, baseTable: BaseTableComponent) => {
        //     let cfg = event.event as CheckboxEvent;

        //     if (!cfg.checked) {
        //         this.checked = false;
        //     }
        // }
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.initConfig();
        this.initProcessEvents();
    }

    public onChangeEvent(event: any) {
        let cbe: CheckboxEvent = {
            colIdx: this.colIdx,
            checked: event.checked,
            rowData: this.rowData,
            isHeaderCheckbox: true,
        }

        let cfg: BaseTableEvent = {
            eventType: this._hcbCfg.eventType,
            event: cbe,
        }
        this.onEvent.emit(cfg)
    }
}
