import { Component, OnInit, ComponentFactoryResolver, ChangeDetectorRef, ViewChild } from '@angular/core';
import { BaseBodyCellItems, BaseTableEvent, BaseTableEventConfig } from '../../../table-api';

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
export class CheckboxComponent extends BaseBodyCellItems implements OnInit {
    public checked: boolean = false;
    public _cbCfg: BaseTableEventConfig;

    constructor() {
        super()
    }

    private initColumnFilterEvent() {
        this._subs.push(
            this.onColumnFilterEvent.subscribe(r => {
                let config = r as CheckboxEvent;

                if (config.checked) {
                    this.checked = true
                    //this.checkbox.disabled = true;
                } else {
                    this.checked = false
                    //this.checkbox.disabled = false;
                }
            })
        )
    }

    private initConfig(){
        if(this.config == undefined){
            throw('MUST SET CONFIG')
        } else{
            this._cbCfg = this.config
        }
    }

    public ngOnInit(): void {
        this.initConfig();
        this.initColumnFilterEvent();
    }

    public onChangeEvent(event: any) {
        console.log(event);

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
