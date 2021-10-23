import { Component, Input, OnInit } from '@angular/core';
import { BaseMobileTableComponent } from '../base-mobile-table/base-mobile-table.component';

@Component({
    selector: 'lib-base-mobile-display-item',
    templateUrl: './base-mobile-display-item.component.html',
    styleUrls: ['./base-mobile-display-item.component.scss']
})
export class BaseMobileDisplayItemComponent extends BaseMobileTableComponent implements OnInit {
    @Input() public rowData: any;
    @Input() public rowIdx: number;
    @Input() public value: any;
    @Input() public processRowData: (rowData: any) => any;

    constructor() { super() }

    public ngOnInit(): void {
    }
}
