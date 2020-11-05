import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { BaseBodyCellComponent } from '../base-body-cell/base-body-cell.component';
import { BaseBodyCellItems, BaseModalConfig, BaseTableEvent } from '../../../table-api';
import { DynamicDetailsTableModalConfig, DynamicDeleteTableModalConfig } from '../table-modal/table-modal.component';
import { MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { BaseTableComponent } from '../../base-table/base-table.component';
import { deepCopyMenuItem } from '../../../copy-util';

export interface RowOptionsConfig extends BaseTableEvent{
  items: MenuItem[];
}

export interface RowOptionsChangeConfig extends BaseTableEvent{
  event?: any;
  rowData?: any;
  baseTable?: BaseTableComponent
}

@Component({
  selector: 'app-row-options',
  templateUrl: './row-options.component.html',
  styleUrls: ['./row-options.component.scss']
})
export class RowOptionsComponent extends BaseBodyCellItems implements OnInit, OnDestroy {
  private _config: RowOptionsConfig;

  public newList: MenuItem[] = [];

  constructor() {
    super();
  }

  private initItems(items: MenuItem[]){
    for(let i = 0; i < items.length; i++){
      if(items[i].items != undefined && items[i].items.length != null && items[i].items.length != 0){
        this.initItems(items[i].items);
      } else{
        items[i].command = (event: any) => {
          let cfg: RowOptionsChangeConfig = {
            columnField: this._config.columnField,
            event: event,
            rowData: this.rowData,
            baseTable: this.baseTable,
          }
          this.onBodyCellEvent.emit(cfg);
        }
      }
    }
  }

  private initConfig(){
    if(this.config != undefined){
      this._config = this.config

      this._config.items.forEach(item => {
        this.newList.push(deepCopyMenuItem(item))
      });

      this.initItems(this.newList);
    } else{
      throw('MUST SET ROW OPTIONS CONFIG');
    }
  }

  public ngOnInit(): void {
    this.initConfig();
  }
}
