import { Component, Input, OnInit } from '@angular/core';
import { FilterDescriptor, BaseTableEvent, TableEvents } from '../../../../table-api';
import { BaseEventComponent } from 'projects/custom-table/src/public-api';

@Component({
    selector: 'lib-base-mobile-filter',
    templateUrl: './base-mobile-filter.component.html',
    styleUrls: ['./base-mobile-filter.component.scss']
})
export abstract class BaseMobileFilterComponent extends BaseEventComponent implements OnInit {
    @Input() public field: string;
    @Input() public selectedValue: any;
    @Input() public operator: any;

    protected emitFilterChange(val: any) {
        const filter: FilterDescriptor = {
            value: val,
            field: this.field,
            operator: this.operator,
        }
        const cfg: BaseTableEvent = {
            eventType: TableEvents.columnFilter,
            eventFieldName: this.field,
            event: filter,
        }

        this.onEvent.emit(cfg);
    }

    public clearFilter() {
        this.selectedValue = null;
    }

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
