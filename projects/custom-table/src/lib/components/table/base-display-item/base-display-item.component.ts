import { Component, Input, OnInit } from '@angular/core';
import { BaseTableComponent } from '../base-table/base-table.component';

@Component({
    selector: 'lib-base-display-item',
    templateUrl: './base-display-item.component.html',
    styleUrls: ['./base-display-item.component.scss']
})
export abstract class BaseDisplayItemComponent extends BaseTableComponent implements OnInit {
    @Input() public rowData: any;
    @Input() public rowIdx: number;
    @Input() public value: any;
    @Input() public processRowData: (rowData: any) => any;

    constructor() { super() }

    public ngOnInit(): void {
    }

}
