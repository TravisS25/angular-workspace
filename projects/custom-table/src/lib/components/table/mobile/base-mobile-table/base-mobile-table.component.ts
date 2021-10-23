import { Component, OnInit } from '@angular/core';
import { BaseMobileTableEventComponent } from '../base-mobile-table-event/base-mobile-table-event.component';
import { BaseTableEventComponent } from '../../base-table-event/base-table-event.component';

@Component({
    selector: 'lib-base-mobile-table',
    templateUrl: './base-mobile-table.component.html',
    styleUrls: ['./base-mobile-table.component.scss']
})
export abstract class BaseMobileTableComponent extends BaseMobileTableEventComponent implements OnInit {
    constructor() { super() }

    public ngOnInit(): void {
    }

}
