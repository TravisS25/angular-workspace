import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MaterialMenuItem } from '../material-menu-item/material-menu-item.component';
import { Menu } from 'primeng';
import { MaterialMenuItemModule } from '../../../modules/material/material-menu-item.module';
import { BaseTableEvent, } from '../../../table-api';
import { MaterialMenuItemComponent } from '../material-menu-item/material-menu-item.component';
import { BaseColumnFilterComponent } from '../../table/base-column-filter/base-column-filter.component';

export interface MaterialRowOptionConfig {
    items: MaterialMenuItem[];
}

@Component({
    selector: 'lib-material-row-options',
    templateUrl: './material-row-options.component.html',
    styleUrls: ['./material-row-options.component.scss']
})
export class MaterialRowOptionsComponent extends BaseColumnFilterComponent implements OnInit {
    constructor() {
        super();
    }

    public ngOnInit(): void {
        if (this.processRowData != undefined) {
            this.config = this.processRowData(this.rowData, this);
        } else if (this.config == undefined) {
            throw ('MUST SET MATERIAL ROW OPTION CONFIG FOR COL IDX ' + this.colIdx);
        }
    }

    public onChangeEvent(event: BaseTableEvent) {
        this.onEvent.emit(event);
    }
}
