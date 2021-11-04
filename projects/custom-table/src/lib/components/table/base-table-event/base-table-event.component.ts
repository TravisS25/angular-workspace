import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseTableEvent } from '../../../table-api';
import { BaseComponent } from '../../base/base.component';
import { BaseEventComponent } from '../base-event/base-event.component';

@Component({
    selector: 'lib-base-table-event',
    templateUrl: './base-table-event.component.html',
    styleUrls: ['./base-table-event.component.scss']
})
export class BaseTableEventComponent extends BaseEventComponent implements OnInit {
    constructor() { super() }

    public ngOnInit(): void {
    }

    // processTableFilterEvent activates whenever the table changes data through
    // a column filter change, pagination etc.
    @Input() public processTableFilterEvent: (event: any, componentRef: any) => void;

    // processClearFiltersEvent activates whenever the "Clear Filters" button
    // is used by user
    @Input() public processClearFiltersEvent: (event: any, componentRef: any) => void;

    // processSortEvent is activated whenever a column is sorted
    @Input() public processSortEvent: (event: any, componentRef: any) => void;

    @Input() public processTableCellEvent: (event: any, componentRef: any) => void;

    @Input() public processDisplayItemEvent: (event: any, componentRef: any) => void;

    @Input() public processColumnFilterEvent: (event: any, componentRef: any) => void;

    @Input() public processInputTemplateEvent?: (event: any, componentRef: any) => void;
}
