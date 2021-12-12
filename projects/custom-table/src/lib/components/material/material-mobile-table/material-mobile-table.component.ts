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
import { materialRowCollapse, materialRowExpand, onMaterialPageChange, onMaterialRowExpandAnimation } from '../material-util';
import { BaseMobileTableConfig } from '../../../table-api';


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

    // table is reference to material table
    @ViewChild(MatTable) public table: MatTable<any>;

    // expandRows is an array of bools whose length will equal the 
    // current page size of table
    //
    // This is used to determine which rows are expanded or not
    // but should not be used directly; instead use the expand
    // and collapse functions to modify
    public expandRows: boolean[] = []

    constructor(
        public http: HttpService,
        public cfr: ComponentFactoryResolver,
        public cdr: ChangeDetectorRef,
    ) {
        super(http, cfr, cdr);
    }

    private initStyles() {
        if (this.config.getRowClass == undefined) {
            this.config.getRowClass = (): string => {
                return '';
            }
        }
        if (this.config.getRowStyle == undefined) {
            this.config.getRowStyle = (): Object => {
                return {}
            }
        }
    }

    private initSubs() {
        this._sub.add(
            this.onTableFilterEvent.subscribe(r => {
                if (this._isFilterInit) {
                    this.table.renderRows();
                    this.expandRows = [];
                }

                for (let i = 0; this.filterData.data.length; i++) {
                    this.expandRows.push(false);
                }

                this._isFilterInit = true;
            })
        )
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.initStyles();
        this.initSubs();
    }

    // onPageChange event determines how many items to take and
    // total number of records
    public onPageChange(event: PageEvent) {
        onMaterialPageChange(event, this.state, this.refresh);
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

    // rowCollapse will collapse given row index
    public rowCollapse(rowIdx: number) {
        materialRowCollapse(rowIdx, this.expandRows)
    }

    // rowExpand will expand given row index
    public rowExpand(rowIdx: number, rowMapKey: string) {
        if (this.config.rowExpansion == undefined) {
            throw ('ROWEXPANSION NOT SET IN CONFIG; CAN NOT EXPAND!');
        } else if (!this.config.rowExpansion.has(rowMapKey)) {
            throw ('KEY "' + rowMapKey + '" DOES NOT EXIST!');
        }

        materialRowExpand(rowIdx, this.expandRows);
        this._currentRowMapKey = rowMapKey;
    }

    public closeRows() {
        for (let i = 0; i < this.expandRows.length; i++) {
            this.rowCollapse(i);
        }
    }
}
