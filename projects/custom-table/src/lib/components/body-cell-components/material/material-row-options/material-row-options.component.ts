import { Component, OnInit } from '@angular/core';
import { BaseBodyCellItems, BaseColumnItems, BaseTableEvent, BaseTableEventConfig, BaseTableItems } from '../../../../table-api';

export interface MaterialRowOptionItem {
    label: string;
    value?: any;
    iconClass?: string;
    iconLabel?: string;
    rowData?: any;
    subMenu?: MaterialRowOptionItem[];
}

export interface MaterialRowOptionConfig extends BaseTableEventConfig{
    items: MaterialRowOptionItem[];
}

@Component({
    selector: 'lib-material-row-options',
    templateUrl: './material-row-options.component.html',
    styleUrls: ['./material-row-options.component.scss']
})
export class MaterialRowOptionsComponent extends BaseBodyCellItems implements OnInit {
    private _cfg: MaterialRowOptionConfig

    constructor() {
        super();
    }

    public ngOnInit(): void {
        if (this.processRowData != undefined) {
            this.config = this.processRowData(this.rowData);
            this._cfg = this.config
        } else {
            if (this.config == undefined) {
                throw ('MUST SET MATERIAL ROW OPTION CONFIG');
            } 

            this._cfg = this.config
        }
    }

    public onClick(event: MaterialRowOptionItem) {
        event.rowData = this.rowData;

        let bteCfg: BaseTableEvent = {
            eventFieldName: this._cfg.eventFieldName,
            event: event,
        }
        this.onBodyCellEvent.emit(bteCfg);
    }
}
