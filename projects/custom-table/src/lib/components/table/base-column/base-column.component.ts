import { Component, Input, OnInit } from '@angular/core';
import { BaseMobileFilterComponent } from '../mobile/base-mobile-filter/base-mobile-filter.component';

@Component({
    selector: 'lib-base-column',
    templateUrl: './base-column.component.html',
    styleUrls: ['./base-column.component.scss']
})
export abstract class BaseColumnComponent extends BaseMobileFilterComponent implements OnInit {
    @Input() public colIdx: number;
    @Input() public isColumnFilter: boolean;
    @Input() public isInputTemplate: boolean;
    @Input() public excludeFilter: boolean;
    @Input() public processRowData: (rowData: any) => any;

    constructor() {
        super();
    }

    public ngOnInit() {
        super.ngOnInit();
    }

}
