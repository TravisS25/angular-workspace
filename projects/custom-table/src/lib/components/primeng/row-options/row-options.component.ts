import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { BaseTableEvent, TableEvents } from '../../../table-api';
import { MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { BaseTableComponent } from '../../table/base-table/base-table.component';
import { deepCopyMenuItem } from '../../../copy-util';
import { BaseColumnFilterComponent } from '../../table/base-column-filter/base-column-filter.component';

export interface RowOptionsConfig {
    items: MenuItem[];
}

export interface RowOptionsChangeEvent extends BaseTableEvent {
    rowData?: any;
    baseTable?: BaseTableComponent
}

@Component({
    selector: 'app-row-options',
    templateUrl: './row-options.component.html',
    styleUrls: ['./row-options.component.scss']
})
export class RowOptionsComponent extends BaseColumnFilterComponent implements OnInit, OnDestroy {
    private _roConfig: RowOptionsConfig;

    public newList: MenuItem[] = [];

    constructor() {
        super();
    }

    private initItems(items: MenuItem[]) {
        for (let i = 0; i < items.length; i++) {
            if (items[i].items != undefined && items[i].items.length != null && items[i].items.length != 0) {
                this.initItems(items[i].items);
            } else {
                items[i].command = (event: any) => {
                    this.onEvent.emit({
                        event: event
                    });
                }
            }
        }
    }

    private initConfig() {
        if (this.config != undefined) {
            this._roConfig = this.config

            this._roConfig.items.forEach(item => {
                this.newList.push(deepCopyMenuItem(item))
            });

            this.initItems(this.newList);
        } else {
            throw ('MUST SET ROW OPTIONS CONFIG');
        }
    }

    public ngOnInit(): void {
        this.initConfig();
    }
}
