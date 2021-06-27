import { Component, OnInit, Input, ViewChildren, ViewChild, Output, EventEmitter, ComponentFactoryResolver, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MultiSelect, MultiSelectItem } from 'primeng/multiselect';
import { FilterDescriptor, FilterData, BaseEventOptions, BaseColumnFilterItems, BaseColumnItems } from '../../../table-api';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import * as moment from 'moment';
import { BaseTableComponent } from '../../base-table/base-table.component';

export interface BaseColumnFilterConfig {
    processBodyCellEvent?: (event: any, baseTable: BaseTableComponent) => void;
    processCaptionEvent?: (event: any, baseTable: BaseTableComponent) => void;
    processTableFilterEvent?: (event: any, baseTable: BaseTableComponent) => void;
}

@Component({
    selector: 'app-base-column-filter',
    templateUrl: './base-column-filter.component.html',
    styleUrls: ['./base-column-filter.component.scss']
})
export class BaseColumnFilterComponent extends BaseColumnFilterItems implements OnInit, OnDestroy {
    constructor() {
        super();
        //this.initBaseColumnProcessFunctions();
    }

    private initBaseColumnProcessFunctions() {
        if (this.config != undefined) {
            let cfg: BaseColumnFilterConfig = this.config;

            if (cfg.processCaptionEvent != undefined) {
                this.onCaptionEvent.subscribe(r => {
                    cfg.processCaptionEvent(r, this.baseTable);
                })
            }
            if (cfg.processBodyCellEvent != undefined) {
                this.onBodyCellEvent.subscribe(r => {
                    cfg.processBodyCellEvent(r, this.baseTable);
                })
            }
            if (cfg.processTableFilterEvent != undefined) {
                this.onTableFilterEvent.subscribe(r => {
                    cfg.processTableFilterEvent(r, this.baseTable);
                })
            }
        }
    }

    protected emitChange(val: any) {
        console.log('emitting change')
        let filter: FilterDescriptor = {
            value: val,
            field: this.field,
            operator: this.operator,
        }
        this.onColumnFilterEvent.emit(filter);

        if (this.config != undefined) {
            let cfg: BaseEventOptions = this.config;

            if (cfg.processColumnFilterEvent != undefined) {
                cfg.processColumnFilterEvent(filter, this.baseTable);
            }
        }
    }

    public ngOnInit(): void {

    }

    public getSelectValue(): any {
        return this.selectedValue;
    }

    public onChangeEvent(event: any) {
        this.emitChange(this.selectedValue)
    }

    public onFilterChange(event: string) {
        this.operator = event;
        this.onChangeEvent(null);
    }

    public ngOnDestroy() {
        this.config = null;
        this.value = null;

        this._subs.forEach(item => {
            item.unsubscribe();
        })
        this._subs = null;
    }
}
