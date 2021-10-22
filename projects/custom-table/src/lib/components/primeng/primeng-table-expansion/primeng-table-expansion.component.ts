import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { BaseColumn, Column, FilterDescriptor } from '../../../table-api';
import { RowToggler } from 'primeng/table';
import { BaseColumnComponent } from '../../table/base-column/base-column.component';
import { TableEvents } from '../../../table-api';


@Component({
    selector: 'lib-primeng-table-expansion',
    templateUrl: './primeng-table-expansion.component.html',
    styleUrls: ['./primeng-table-expansion.component.scss']
})
export class PrimengTableExpansionComponent extends BaseColumnComponent implements OnInit {
    @ViewChild(RowToggler, { static: false }) public toggler: RowToggler;

    public expanded: boolean = false;

    constructor() {
        super()
    }

    private closeExpansion() {
        this.expanded = false;

        if (this.toggler.dt.isRowExpanded(this.rowData)) {
            this.toggler.dt.toggleRow(this.rowData);
        }
    }

    private initEvents() {
        this._subs.push(
            this.onEvent.subscribe(r => {
                switch (r) {
                    case TableEvents.clearFilters, TableEvents.columnFilter, TableEvents.tableFilters:
                        this.closeExpansion();
                }

                if (this.processEvent != undefined) {
                    this.processEvent(r, this);
                }
            })
        )
    }

    public ngOnInit(): void {
        this.initEvents();
    }

    public ngAfterViewInit() {
        this._subs.push(
            this.toggler.dt.onRowExpand.subscribe(r => {
                if (r.data.id == this.rowData.id) {
                    this.expanded = true;
                }

                //console.log('detect row expand');
            })
        );

        this.toggler.dt.onRowCollapse.subscribe(r => {
            //console.log('detect row collapse');
            if (r.data.id == this.rowData.id) {
                this.expanded = false;
            }
        })
    }
}
