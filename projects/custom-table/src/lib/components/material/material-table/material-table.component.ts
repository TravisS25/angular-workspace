import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, Input, OnInit, ViewChild } from '@angular/core';
import { BaseTableConfig, CoreColumn, DefaultTableEvents } from '../../../table-api';
import { HttpService } from '../../../services/http.service';
import { BaseTableComponent } from '../../table/base-table/base-table.component';
import { MatTable } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import { TableEvents } from '../../../table-api';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PageEvent } from '@angular/material/paginator';
import { materialRowCollapse, materialRowExpand, onMaterialPageChange, onMaterialRowExpandAnimation, onMaterialSortChange } from '../material-util';


export interface MaterialTableConfig extends BaseTableConfig {

}

export interface MaterialColumn extends CoreColumn {
    activateTemplating?: boolean;
}

@Component({
    selector: 'lib-material-table',
    templateUrl: './material-table.component.html',
    styleUrls: ['./material-table.component.scss'],
    animations: [
        trigger('rowExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class MaterialTableComponent extends BaseTableComponent implements OnInit {
    // table is reference to material table
    @ViewChild(MatTable, { static: false }) public table: MatTable<any>;

    // columns is re-declared here for type saftey from "CoreColumn" type to "MaterialColumn"
    public columns: MaterialColumn[];

    // columnsToDisplay is used to gather all the column header names from MaterialColumn#columns
    // to be referenced within material table template
    public columnsToDisplay: string[] = [];

    // expandRows is an array of bools whose length will equal the 
    // current page size of table
    //
    // This is used to determine which rows are expanded or not
    // but should not be used directly; instead use the expand
    // and collapse functions to modify
    public expandRows: boolean[] = []

    constructor(
        public cdr: ChangeDetectorRef,
        public cfr: ComponentFactoryResolver,
        public http: HttpService,
    ) { super(cdr, cfr, http) }

    private initColumnHeaders() {
        this.columns.forEach(item => {
            this.columnsToDisplay.push(item.field);
        })
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.initColumnHeaders();
        console.log()
    }

    public onSortChange(sort: Sort) {
        onMaterialSortChange(
            sort,
            this.onSortEvent,
            this.config.autoSearch,
            this.state,
            this.update,
        )
    }

    // onPageChange event determines how many items to take and
    // total number of records
    public onPageChange(event: PageEvent) {
        onMaterialPageChange(event, this.state, this.update);
    }

    // rowCollapse will collapse given row index
    public rowCollapse(rowIdx: number) {
        materialRowCollapse(rowIdx, this.expandRows);
    }

    // rowExpand will expand given row index
    public rowExpand(rowIdx: number) {
        materialRowExpand(rowIdx, this.expandRows);
    }

    public closeRows() {
        for (let i = 0; i < this.expandRows.length; i++) {
            this.rowCollapse(i);
        }
    }

    // onRowExpandAnimation will activate when table row either expands or collapses
    // This function will create row expansion component on expand, if not already created
    public onRowExpandAnimation(event: AnimationEvent, rowIdx: number) {
        onMaterialRowExpandAnimation(
            event,
            rowIdx,
            this.rowExpansionDirs,
            this.rowExpansionCrs,
            this.config.rowExpansion,
            this.cfr,
            this,
        )
    }

    ///////////////////////////////////////////
    // SET FUNCTIONS
    ///////////////////////////////////////////

    public setTableConfig(cfg: MaterialTableConfig) {
        this.config = cfg;
    }

    ///////////////////////////////////////////
    // GET FUNCTIONS
    ///////////////////////////////////////////

    public getTableConfig(): MaterialTableConfig {
        return this.config;
    }
}
