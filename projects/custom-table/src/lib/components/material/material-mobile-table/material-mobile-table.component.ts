import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, Directive, EventEmitter, Input, OnDestroy, OnInit, QueryList, Type, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import _ from "lodash" // Import the entire lodash library
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { encodeURIState } from '../../../util';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/combineLatest';
import { take } from 'rxjs/operators';
import { BaseMobileTableComponent } from '../../table/mobile/base-mobile-table/base-mobile-table.component';
import { MatTable } from '@angular/material/table';
import { HttpService } from '../../../services/http.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { onMaterialRowExpandAnimation } from '../material-util';


@Component({
    selector: 'lib-material-mobile-table',
    templateUrl: './material-mobile-table.component.html',
    styleUrls: ['./material-mobile-table.component.scss'],
    animations: [
        trigger('rowExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class MaterialMobileTableComponent extends BaseMobileTableComponent implements OnInit {
    // _currentRowMapKey is used to keep track of the key to access in config#rowExpansion
    private _currentRowMapKey: string;

    // _isFilterInit is flag to determine if table filter has been called at least once
    // This is used to determine if we need to re-render rows for table
    //
    // This will be set to true after the first table filter event is activated
    private _isFilterInit = false;

    // table is reference to table
    @ViewChild(MatTable) public table: MatTable<any>;

    // expandRow is an array of bools whose length will equal the 
    // current page size of table
    //
    // This is used to determine which rows are expanded or not
    // but should not be used directly; instead use the expand
    // and collapse functions to modify
    public expandRow: boolean[] = []

    // expandedRows keeps track of rows that have already been expanded
    // This is used so we don't have to re-generate expansion rows that 
    // have already been created
    public expandedRows: number[] = [];

    constructor(
        public http: HttpService,
        public cfr: ComponentFactoryResolver,
        public cdr: ChangeDetectorRef,
    ) {
        super(http, cfr, cdr);
    }

    private initSubs() {
        this._sub.add(
            this.onTableFilterEvent.subscribe(r => {
                if (this._isFilterInit) {
                    this.table.renderRows();
                    this.expandRow = [];
                    this.expandedRows = [];
                }

                for (let i = 0; this.filterData.data.length; i++) {
                    this.expandRow.push(false);
                }

                this._isFilterInit = true;
            })
        )
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.initSubs();
    }

    // onPageChange event determines how many items to take and
    // total number of records
    public onPageChange(event: PageEvent) {
        this.state.take = event.pageSize;
        this.state.skip = event.pageIndex * event.pageSize;
        this.refresh();
    }

    // onRowExpandAnimation will activate when table row either expands or collapses
    // This function will create row expansion component on expand, if not already created
    public onRowExpandAnimation(event: AnimationEvent, rowIdx: number) {
        onMaterialRowExpandAnimation(
            event,
            rowIdx,
            this.rowExpansionDirs,
            this.rowExpansionCrs,
            this.config.rowExpansion.get(this._currentRowMapKey),
            this.cfr,
            this,
        )
    }

    // collapse will collapse given row index
    public rowCollapse(rowIdx: number) {
        if (rowIdx > -1 && rowIdx < this.expandRow.length) {
            this.expandRow[rowIdx] = false;
        }
    }

    // expand will expand given row index
    public rowExpand(rowIdx: number, rowMapKey: string) {
        if (this.config.rowExpansion == undefined) {
            throw ('ROWEXPANSION NOT SET IN CONFIG; CAN NOT EXPAND!');
        } else if (!this.config.rowExpansion.has(rowMapKey)) {
            throw ('KEY "' + rowMapKey + '" DOES NOT EXIST!');
        }

        this._currentRowMapKey = rowMapKey;

        if (rowIdx > -1 && rowIdx < this.expandRow.length) {
            this.expandRow[rowIdx] = true;
        }
    }
}
