import { Component, Input, OnInit } from '@angular/core';
import { BaseEventComponent } from '../base-event/base-event.component';

// BaseDisplayItemComponent is component that is a "subset" of the BaseColumnFilterComponent component
// in that this component should only be used to display text/icons and not form fields
@Component({
    selector: 'lib-base-display-item',
    templateUrl: './base-display-item.component.html',
    styleUrls: ['./base-display-item.component.scss']
})
export abstract class BaseDisplayItemComponent extends BaseEventComponent implements OnInit {
    // processRowData is function that allows us to process the row data
    // and manipulate the current component through componentRef
    @Input() public processRowData: (rowData: any, componentRef: any) => void;

    //
    // The below inputs are ones that will be set by the table api and
    // should NOT be set manually as they will be overwritten
    //

    // colIdx is column index of current component
    @Input() public colIdx: number;

    // rowData is data for current row
    @Input() public rowData: any;

    // rowIdx is row index of current component
    @Input() public rowIdx: number;

    constructor() { super() }
}
