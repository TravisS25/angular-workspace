import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BaseTableEvent } from '../../../table-api';
import { BaseComponent } from '../../base/base.component';

@Component({
    selector: 'lib-base-table-event',
    templateUrl: './base-table-event.component.html',
    styleUrls: ['./base-table-event.component.scss']
})
export class BaseTableEventComponent extends BaseComponent implements OnInit {
    @Output() public onEvent: EventEmitter<BaseTableEvent> = new EventEmitter();

    constructor() { super() }

    public ngOnInit(): void {
    }

    // processCaptionEvent activates whenever an event is broadcast from the caption
    public processCaptionEvent: (event: any, componentRef: any) => void;

    // processTableFilterEvent activates whenever the table changes data through
    // a column filter change, pagination etc.
    public processTableFilterEvent: (event: any, componentRef: any) => void;

    // processClearFiltersEvent activates whenever the "Clear Filters" button
    // is used by user
    public processClearFiltersEvent: (event: any, componentRef: any) => void;

    // processSortEvent is activated whenever a column is sorted
    public processSortEvent: (event: any, componentRef: any) => void;

    // processOuterEvent is activated whenever an event outside of the table
    // occurs but we may want to process it and modify something within the table
    public processOuterEvent: (event: any, componentRef: any) => void;

    public processBodyCellEvent: (event: any, componentRef: any) => void;

    public processColumnFilterEvent: (event: any, componentRef: any) => void;

    public processInputTemplateEvent: (event: any, componentRef: any) => void;
}
