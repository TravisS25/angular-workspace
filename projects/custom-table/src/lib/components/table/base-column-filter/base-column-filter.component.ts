import { Component, Input, OnInit } from '@angular/core';
import { BaseDisplayItemComponent } from '../base-display-item/base-display-item.component';
import { BaseTableEvent, FilterDescriptor, TableEvents } from '../../../table-api';
// BaseColumnFilterComponent is component that should be extended by a component that is
// a form field to either make requests to server and be used for inline editing
@Component({
    selector: 'lib-base-column-filter',
    templateUrl: './base-column-filter.component.html',
    styleUrls: ['./base-column-filter.component.scss']
})
export abstract class BaseColumnFilterComponent extends BaseDisplayItemComponent implements OnInit {
    // field should be the name of the column filter that will be sent to server
    @Input() public field: string;

    // selectedValue is default value that will be selected when component is rendered
    @Input() public selectedValue: any;

    // operator is filter that will be applied when making request to server
    @Input() public operator: any;

    // excludeFilter is setting that allows us to block request from being sent to server
    @Input() public excludeFilter: boolean;

    //
    // The below inputs are ones that will be set by the table api and
    // should NOT be set manually as they will be overwritten
    //

    // isInputTemplate determines if current component is input template
    @Input() public isInputTemplate: boolean;

    // isColumnFilter determines if current component is column filter
    // to make request to server or simply a form field to be used for
    // inline editing
    @Input() public isColumnFilter: boolean;

    // emitFilterChange is used by extended class to choose custom value
    // that will be emitted by component on an event
    protected emitFilterChange(val: any) {
        const filter: FilterDescriptor = {
            value: val,
            field: this.field,
            operator: this.operator,
        }

        this.onEvent.emit({
            eventFieldName: this.field,
            event: filter,
        });
    }

    // clearFilter clears the value of current component
    public clearFilter() {
        this.selectedValue = null;
    }

    // onFilterChange is used by extended class to change
    // current filter operator and emit event
    public onFilterChange(event: string) {
        this.operator = event;
        this.emitFilterChange(this.selectedValue);
    }

    constructor() {
        super();
    }

    public ngOnInit() {
        super.ngOnInit();

        if (this.operator == undefined) {
            this.operator = 'eq';
        }
    }
}
