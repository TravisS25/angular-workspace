import { Component, Input, OnInit } from '@angular/core';
import { BaseDisplayItemI } from 'projects/custom-table/src/public-api';
import { BaseTableEventComponent } from '../base-table-event/base-table-event.component';
import { BaseTableComponent } from '../base-table/base-table.component';
import { BaseMobileTableEventComponent } from '../mobile/base-mobile-table-event/base-mobile-table-event.component';

@Component({
    selector: 'lib-base-display-item',
    templateUrl: './base-display-item.component.html',
    styleUrls: ['./base-display-item.component.scss']
})
export abstract class BaseDisplayItemComponent extends BaseTableEventComponent implements OnInit {
    @Input() public colIdx: number;
    @Input() public rowData: any;
    @Input() public rowIdx: number;
    @Input() public value: any;
    @Input() public processRowData: (rowData: any) => any;

    constructor() { super() }

    public ngOnInit(): void {
    }

}
