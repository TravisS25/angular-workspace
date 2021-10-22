import { Component, Input, OnInit } from '@angular/core';
import { BaseTableI } from '../../../../public-api';
import { BaseComponent } from '../../base/base.component';

@Component({
    selector: 'lib-base-table',
    templateUrl: './base-table.component.html',
    styleUrls: ['./base-table.component.scss']
})
export abstract class BaseTableComponent extends BaseComponent implements BaseTableI, OnInit {
    @Input() public baseTable: any;
    @Input() public outerData: any;

    constructor() { super() }

    public ngOnInit(): void {
    }

}
