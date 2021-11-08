import { Component, Input, OnInit } from '@angular/core';
import { BaseTableEvent, FilterDescriptor, TableEvents } from '../../../table-api';
import { BaseComponent } from '../../base/base.component';
import { BaseMobileFilterComponent } from '../mobile/base-mobile-filter/base-mobile-filter.component';

@Component({
    selector: 'lib-base-column-filter',
    templateUrl: './base-column-filter.component.html',
    styleUrls: ['./base-column-filter.component.scss']
})
export class BaseColumnFilterComponent extends BaseMobileFilterComponent implements OnInit {
    @Input() public colIdx: number;
    @Input() public isColumnFilter: boolean;
    @Input() public isInputTemplate: boolean;
    @Input() public excludeFilter: boolean;
    @Input() public rowIdx: number;
    @Input() public rowData: any;
    @Input() public processRowData: (rowData: any, componentRef: any) => void;

    constructor() {
        super();
    }

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

    public ngOnInit() {
        super.ngOnInit();

        if (this.operator == undefined) {
            this.operator = 'eq';
        }
    }

}
