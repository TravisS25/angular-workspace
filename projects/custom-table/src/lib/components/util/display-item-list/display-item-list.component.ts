import { Component, OnInit } from '@angular/core';
import { BaseDisplayItem, BaseTableEvent } from '../../../table-api';

@Component({
    selector: 'lib-display-item-list',
    templateUrl: './display-item-list.component.html',
    styleUrls: ['./display-item-list.component.scss']
})
export class DisplayItemListComponent extends BaseDisplayItem implements OnInit {
    constructor() { super() }

    private initValues() {
        if (this.config == undefined && this.processRowData == undefined) {
            throw ('MUST SET CONFIG OR PROCESS ROW DATA FOR FORM ITEM COMPONENT!');
        }
        if (this.processRowData != undefined) {
            this.config = this.processRowData(this.rowData);
        }
    }

    public ngOnInit(): void {
        this.initValues();
    }

    public displayEvent(event: BaseTableEvent) {
        console.log('dispaly event');
        console.log(event)
        this.onEvent.emit(event);
    }

}
