import { Component, Input, OnInit } from '@angular/core';
import { BaseMobileTableEventComponent } from '../base-mobile-table-event/base-mobile-table-event.component';
import { BaseMobileTableComponent } from '../base-mobile-table/base-mobile-table.component';

@Component({
    selector: 'lib-base-mobile-display-item',
    templateUrl: './base-mobile-display-item.component.html',
    styleUrls: ['./base-mobile-display-item.component.scss']
})
export class BaseMobileDisplayItemComponent extends BaseMobileTableEventComponent implements OnInit {
    @Input() public isTitlePanel: boolean;
    @Input() public rowData: any;
    @Input() public rowIdx: number;
    @Input() public processRowData: (rowData: any, componentRef: any) => void;

    constructor() { super() }

    public ngOnInit(): void {
    }
}
