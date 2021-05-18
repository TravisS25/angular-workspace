import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { BaseBodyCellItems, BaseModalConfig, BaseTableEvent, BaseTableEventConfig } from '../../../table-api';
import { DynamicDetailsTableModalConfig, DynamicDeleteTableModalConfig } from '../table-modal/table-modal.component';
import { MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { BaseTableComponent } from '../../base-table/base-table.component';
import { deepCopyMenuItem } from '../../../copy-util';

export interface RowOptionsConfig extends BaseTableEventConfig {
    items: MenuItem[];
}

export interface RowOptionsChangeEvent extends BaseTableEvent {
    baseTable?: BaseTableComponent
}

@Component({
    selector: 'app-row-options',
    templateUrl: './row-options.component.html',
    styleUrls: ['./row-options.component.scss']
})
export class RowOptionsComponent extends BaseBodyCellItems implements OnInit, OnDestroy {
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
                    let cfg: BaseTableEvent = {
                        eventFieldName: this._roConfig.eventFieldName,
                        event: event,
                    }

                    this.onBodyCellEvent.emit(cfg);
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
