import { Component, OnInit } from '@angular/core';
import { BaseBodyCellItems, BaseColumnItems, BaseTableEvent, BaseTableEventConfig, BaseTableItems } from '../../../../table-api';

export interface MaterialRowOptionItem extends BaseTableEventConfig {
    label: string;
    value?: any;
    iconClass?: string;
    iconLabel?: string;
    rowData?: any;
    subMenu?: MaterialRowOptionItem[];
}

@Component({
    selector: 'lib-material-row-options',
    templateUrl: './material-row-options.component.html',
    styleUrls: ['./material-row-options.component.scss']
})
export class MaterialRowOptionsComponent extends BaseBodyCellItems implements OnInit {
    constructor() {
        super();
    }

    public ngOnInit(): void {
        if (this.processRowData != undefined) {
            this.config = this.processRowData(this.rowData);
        } else {
            if (this.config == undefined) {
                throw ('MUST SET MATERIAL MENU CONFIG');
            } 
        }
    }

    public onClick(event: MaterialRowOptionItem) {
        event.rowData = this.rowData;

        let bteCfg: BaseTableEvent = {
            eventFieldName: this.field,
            event: event,
        }
        this.onBodyCellEvent.emit(bteCfg);
    }
}
