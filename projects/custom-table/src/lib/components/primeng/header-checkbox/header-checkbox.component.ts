import { Component, OnInit, ComponentFactoryResolver, ChangeDetectorRef, ViewChild, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Checkbox } from 'primeng/checkbox';
import { CheckboxEvent } from '../../component-config';
import { BaseColumnItems, BaseTableEvent, BaseTableEventConfig } from '../../../table-api';

@Component({
    selector: 'app-header-checkbox',
    templateUrl: './header-checkbox.component.html',
    styleUrls: ['./header-checkbox.component.scss']
})
export class HeaderCheckboxComponent extends BaseColumnItems implements OnInit, OnDestroy {
    public checked: boolean = false;
    private _hcbCfg: BaseTableEventConfig

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
            this._hcbCfg = this.config;
        }
    }

    private initTableFilterEvent() {
        this._subs.push(
            this.onTableFilterEvent.subscribe(r => {
                this.checked = false;
            })
        )
    }

    private initBodyCellEvent() {
        this._subs.push(
            this.onBodyCellEvent.subscribe(r => {
                let config = r as CheckboxEvent;

                if (!config.checked) {
                    console.log('change value')
                    this.checked = false;
                }
            })
        );
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.initConfig();
        this.initBodyCellEvent();
        this.initTableFilterEvent();
    }

    public onChangeEvent(event: any) {
        let cbe: CheckboxEvent = {
            colIdx: this.colIdx,
            checked: event.checked,
            rowData: this.rowData,
            isHeaderCheckbox: true,
        }

        let cfg: BaseTableEvent = {
            eventFieldName: this._hcbCfg.eventFieldName,
            event: cbe,
        }
        this.onColumnFilterEvent.emit(cfg)
    }
}
