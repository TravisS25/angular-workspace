import { Component, Input, OnInit } from '@angular/core';
import { BaseTableEventComponent } from '../base-table-event/base-table-event.component';

@Component({
    selector: 'lib-base-table',
    templateUrl: './base-table.component.html',
    styleUrls: ['./base-table.component.scss']
})
export abstract class BaseTableComponent extends BaseTableEventComponent implements OnInit {
    constructor() { super() }

    public ngOnInit(): void {
    }

}
