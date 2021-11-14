import { ChangeDetectorRef, Component, ComponentFactoryResolver, Input, OnInit, ViewChild } from '@angular/core';
import { BaseTableConfig, CoreColumn, DefaultTableEvents } from '../../../table-api';
import { HttpService } from '../../../services/http.service';
import { BaseTableComponent } from '../../table/base-table/base-table.component';
import { MatTable } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import { TableEvents } from '../../../table-api';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PageEvent } from '@angular/material/paginator';
import { onMaterialPageChange, onMaterialRowExpandAnimation, onMaterialSortChange } from '../material-util';


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
    @ViewChild(MatTable, { static: false }) public table: MatTable<any>;

    public columns: MaterialColumn[];
    public columnHeaders: string[] = [];

    constructor(
        public cdr: ChangeDetectorRef,
        public cfr: ComponentFactoryResolver,
        public http: HttpService,
    ) { super(cdr, cfr, http) }

    private initValues() {
        this.config.columns.forEach(item => {
            this.columnHeaders.push(item.header);
        })
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.initValues();
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

    public onPageChange(event: PageEvent) {
        onMaterialPageChange(event, this.state, this.update);
    }

    public closeRows() {

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
