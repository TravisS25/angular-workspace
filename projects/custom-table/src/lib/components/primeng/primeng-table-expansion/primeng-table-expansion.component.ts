import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { RowToggler } from 'primeng/table';
import { BaseColumnFilterComponent } from '../../table/base-column-filter/base-column-filter.component';
import { TableEvents } from '../../../table-api';

@Component({
    selector: 'lib-primeng-table-expansion',
    templateUrl: './primeng-table-expansion.component.html',
    styleUrls: ['./primeng-table-expansion.component.scss']
})
export class PrimengTableExpansionComponent extends BaseColumnFilterComponent implements OnInit {
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
        this.processColumnFilterEvent = (event: any, baseTable: any) => {
            this.closeExpansion();
        }
        this.processTableFilterEvent = (event: any, baseTable: any) => {
            this.closeExpansion();
        }
        this.processClearFiltersEvent = (event: any, baseTable: any) => {
            this.closeExpansion();
        }
    }

    public ngOnInit(): void {
        this.initEvents();
    }

    public ngAfterViewInit() {
        this._sub.add(
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
