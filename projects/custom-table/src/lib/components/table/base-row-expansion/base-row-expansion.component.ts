import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { BaseTableEventComponent } from '../base-table-event/base-table-event.component';
import { BaseComponent } from '../../base/base.component';

@Component({
    selector: 'lib-base-row-expansion',
    templateUrl: './base-row-expansion.component.html',
    styleUrls: ['./base-row-expansion.component.scss']
})
export abstract class BaseRowExpansionComponent extends BaseTableEventComponent implements OnInit {
    @Input() public renderCallback: EventEmitter<any>;

    constructor() { super() }

    ngOnInit(): void {
    }

}
