import { Component, OnInit, ComponentFactoryResolver, ChangeDetectorRef, ViewChild, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Checkbox } from 'primeng/checkbox';
import { CheckboxEvent } from '../../component-config';
import { BaseTableEvent } from '../../../table-api';
//import { MaterialCheckboxConfig } from '../../component-config';
import { BaseColumn } from '../../../table-api';
import { BaseTableComponent } from '../../base-table/base-table.component';
import { MaterialCheckboxConfig } from '../material-checkbox/material-checkbox.component';
import { DefaultTableEvents } from '../../../config';

@Component({
    selector: 'lib-material-header-checkbox',
    templateUrl: './material-header-checkbox.component.html',
    styleUrls: ['./material-header-checkbox.component.scss']
})
export class MaterialHeaderCheckboxComponent extends BaseColumn implements OnInit, OnDestroy {
    public checked: boolean = false;
    public cfg: MaterialCheckboxConfig;
    // public cfg: MaterialCheckboxConfig

    constructor(
        public http: HttpClient,
        public cfr: ComponentFactoryResolver,
        public cdr: ChangeDetectorRef,
    ) {
        super();
    }

    private initConfig() {
        if (this.config == undefined) {
            throw ('MUST SET CONFIG FOR HEADER CHECKBOX');
        } else {
            this.cfg = this.config;

            if (this.cfg.name == undefined) {
                this.cfg.name = 'header-checkbox'
            }

            this.config = this.cfg;
        }

        //this.excludeFilter = true;
    }

    private initEventListeners() {
        this.processTableFilterEvent = (event: any, baseTable: BaseTableComponent) => {
            this.checked = false;
        }
        this.processBodyCellEvent = (event: BaseTableEvent, baseTable: BaseTableComponent) => {
            let cfg = event.event as CheckboxEvent

            if (!cfg.checked) {
                console.log('change value')
                this.checked = false;
            }
        }
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.initConfig();
        this.initEventListeners();
    }

    public onChangeEvent(event: any) {
        let cbe: CheckboxEvent = {
            colIdx: this.colIdx,
            checked: event.checked,
            rowData: this.rowData,
            isHeaderCheckbox: true,
        }

        let cfg: BaseTableEvent = {
            eventType: DefaultTableEvents.ColumnFilter,
            event: cbe,
        }
        this.onEvent.emit(cfg)
    }

}
