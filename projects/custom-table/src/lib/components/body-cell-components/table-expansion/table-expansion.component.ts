import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { BaseColumn, Column, FilterDescriptor } from '../../../table-api';
import { RowToggler } from 'primeng/table';
import { BaseTableComponent } from '../../base-table/base-table.component';

@Component({
    selector: 'app-table-expansion',
    templateUrl: './table-expansion.component.html',
    styleUrls: ['./table-expansion.component.scss']
})
export class TableExpansionComponent extends BaseColumn implements OnInit, AfterViewInit, OnDestroy {
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
        let columnFilterFunc = this.processColumnFilterEvent;
        let tableFilterFunc = this.processTableFilterEvent;
        let clearFiltersFunc = this.processClearFiltersEvent;

        this.processColumnFilterEvent = (event: any, baseTable: BaseTableComponent) => {
            this.closeExpansion();

            if (columnFilterFunc != undefined) {
                columnFilterFunc(event, baseTable);
            }
        }
        this.processTableFilterEvent = (event: any, baseTable: BaseTableComponent) => {
            this.closeExpansion();

            if (tableFilterFunc != undefined) {
                tableFilterFunc(event, baseTable);
            }
        }
        this.processClearFiltersEvent = (event: any, baseTable: BaseTableComponent) => {
            this.closeExpansion();

            if (clearFiltersFunc != undefined) {
                clearFiltersFunc(event, baseTable);
            }
        }
    }

    public ngOnInit(): void {
        //this.initEvents();
    }

    public ngAfterViewInit() {
        this.initEvents();
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

    // public ngOnDestroy(){
    //   this._subs.forEach(item => {
    //     item.unsubscribe();
    //   })
    //   this._subs = null;
    // }
}
