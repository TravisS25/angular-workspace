import { Component, Input, OnInit } from '@angular/core';
import { BaseEventComponent } from 'projects/custom-table/src/public-api';

@Component({
    selector: 'lib-base-display-item',
    templateUrl: './base-display-item.component.html',
    styleUrls: ['./base-display-item.component.scss']
})
export abstract class BaseDisplayItemComponent extends BaseEventComponent implements OnInit {
    @Input() public colIdx: number;
    @Input() public rowData: any;
    @Input() public rowIdx: number;
    @Input() public processRowData: (rowData: any, componentRef: any) => void;

    constructor() { super() }

    public ngOnInit(): void {
    }

}
