import { Component, OnInit, ComponentFactoryResolver, ChangeDetectorRef, ViewChild, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Checkbox } from 'primeng/checkbox';
import { CheckboxEvent } from '../../../body-cell-components/checkbox/checkbox.component';
import { BaseColumnFilterItems, BaseTableEvent, BaseTableEventConfig } from '../../../../table-api';
import { MaterialCheckboxConfig } from '../../../body-cell-components/material/material-checkbox/material-checkbox.component';

@Component({
    selector: 'lib-material-header-checkbox',
    templateUrl: './material-header-checkbox.component.html',
    styleUrls: ['./material-header-checkbox.component.scss']
})
export class MaterialHeaderCheckboxComponent extends BaseColumnFilterItems implements OnInit, OnDestroy {
    public checked: boolean = false;
    public cfg: MaterialCheckboxConfig

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
        }
    }

    private initEventListeners() {
        this._subs.push(
            this.onTableFilterEvent.subscribe(r => {
                this.checked = false;
            }),
            this.onBodyCellEvent.subscribe(r => {
                let event = r as BaseTableEvent;
                let cfg = event.event as CheckboxEvent

                if (!cfg.checked) {
                    console.log('change value')
                    this.checked = false;
                }
            })
        )
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
            eventFieldName: this.cfg.eventFieldName,
            event: cbe,
        }
        this.onColumnFilterEvent.emit(cfg)
    }

}
