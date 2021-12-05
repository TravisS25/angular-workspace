import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseTableEvent } from '../../../table-api';
import { BaseComponent } from '../../base/base.component';

// BaseEventComponent should be extended by any component within table
// and is responsible for processing any events that occurs within table
@Component({
    selector: 'lib-base-event',
    templateUrl: './base-event.component.html',
    styleUrls: ['./base-event.component.scss']
})
export abstract class BaseEventComponent extends BaseComponent implements OnInit {
    // processCaptionEvent will process any event that is emitted from caption of table
    @Input() public processCaptionEvent: (event: BaseTableEvent, componentRef: any) => void;

    // processPopupEvent will process any event that occurs within a popup form/display
    @Input() public processPopupEvent?: (event: BaseTableEvent, componentRef: any) => void;

    // processTableFilterEvent activates whenever the table changes data through
    // a column filter change, pagination etc.
    @Input() public processTableFilterEvent: (event: BaseTableEvent, componentRef: any) => void;

    @Input() public processTableFilterErrorEvent?: (event: BaseTableEvent, componentRef: any) => void;

    @Input() public processTableSettingsFilterEvent?: (event: BaseTableEvent, componentRef: any) => void;

    @Input() public processTableSettingsFilterErrorEvent?: (event: BaseTableEvent, componentRef: any) => void;

    // processClearFiltersEvent activates whenever the "Clear Filters" button
    // is used by user
    @Input() public processClearFiltersEvent: (event: BaseTableEvent, componentRef: any) => void;

    // processSortEvent is activated whenever a column is sorted
    @Input() public processSortEvent: (event: BaseTableEvent, componentRef: any) => void;

    @Input() public processTableCellEvent: (event: BaseTableEvent, componentRef: any) => void;

    @Input() public processColumnFilterEvent: (event: BaseTableEvent, componentRef: any) => void;

    @Input() public processInputTemplateEvent?: (event: BaseTableEvent, componentRef: any) => void;

    // processDisplayItemEvent will process any event that comes from mobile table row
    @Input() public processDisplayItemEvent: (event: BaseTableEvent, componentRef: any) => void;

    constructor() { super() }
}
