import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MaterialMenuItem } from '../material-menu-item/material-menu-item.component';
import { Menu } from 'primeng';
import { MaterialMenuItemModule } from '../../../modules/material/material-menu-item.module';
import { BaseColumnItems, BaseTableEvent, BaseTableEventConfig, BaseTableItems } from '../../../table-api';
import { MaterialMenuItemComponent } from '../material-menu-item/material-menu-item.component';

export interface MaterialRowOptionConfig extends BaseTableEventConfig {
    items: MaterialMenuItem[];
}

@Component({
    selector: 'lib-material-row-options',
    templateUrl: './material-row-options.component.html',
    styleUrls: ['./material-row-options.component.scss']
})
export class MaterialRowOptionsComponent extends BaseColumnItems implements OnInit {
    private _cfg: MaterialRowOptionConfig

    constructor() {
        super();
    }

    public ngOnInit(): void {
        if (this.processRowData != undefined) {
            this.config = this.processRowData(this.rowData);
            this._cfg = this.config
        } else {
            if (this.config == undefined) {
                throw ('MUST SET MATERIAL ROW OPTION CONFIG FOR COL IDX ' + this.colIdx);
            }

            this._cfg = this.config
        }
    }

    public onChangeEvent(event: BaseTableEvent) {
        this.onEvent.emit(event);
    }
}
