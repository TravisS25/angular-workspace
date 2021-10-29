import { Component, Input, OnInit } from '@angular/core';
import { FilterDescriptor, BaseTableEvent, TableEvents } from '../../../../table-api';
import { BaseComponent } from '../../../base/base.component';
import { BaseTableCaptionComponent } from '../../base-table-caption/base-table-caption.component';
import { BaseTableEventComponent } from '../../base-table-event/base-table-event.component';
import { BaseTableComponent } from '../../base-table/base-table.component';

@Component({
    selector: 'lib-base-mobile-filter',
    templateUrl: './base-mobile-filter.component.html',
    styleUrls: ['./base-mobile-filter.component.scss']
})
export abstract class BaseMobileFilterComponent extends BaseTableEventComponent implements OnInit {
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
            eventType: TableEvents,
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
