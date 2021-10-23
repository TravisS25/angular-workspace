import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BaseTableEvent } from '../../../../table-api';
import { BaseComponent } from '../../../base/base.component';

@Component({
    selector: 'lib-base-mobile-table-event',
    templateUrl: './base-mobile-table-event.component.html',
    styleUrls: ['./base-mobile-table-event.component.scss']
})
export abstract class BaseMobileTableEventComponent extends BaseComponent implements OnInit {
    @Output() public onEvent: EventEmitter<BaseTableEvent> = new EventEmitter();

    constructor() { super() }

    public ngOnInit(): void {
    }

    public processCaptionEvent: (event: any, componentRef: any) => void;
    public processPanelTitleEvent: (event: any, componentRef: any) => void;
    public processPanelDescriptionEvent: (event: any, componentRef: any) => void;

    // processTableFilterEvent activates whenever the table changes data through
    // a column filter change, pagination etc.
    public processTableFilterEvent?: (event: any, componentRef: any) => void;

    // processClearFiltersEvent activates whenever the "Clear Filters" button
    // is used by user
    public processClearFiltersEvent?: (event: any, componentRef: any) => void;

    // processSortEvent is activated whenever a column is sorted
    public processSortEvent?: (event: any, componentRef: any) => void;

    // processOuterEvent is activated whenever an event outside of the table
    // occurs but we may want to process it and modify something within the table
    public processOuterEvent?: (event: any, componentRef: any) => void;
}
