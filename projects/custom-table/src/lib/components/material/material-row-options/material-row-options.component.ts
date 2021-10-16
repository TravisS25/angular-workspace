import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MaterialMenuItem } from '../material-menu-item/material-menu-item.component';
import { Menu } from 'primeng';
import { MaterialMenuItemModule } from '../../../modules/material/material-menu-item.module';
import { BaseColumnItems, BaseTableEvent, } from '../../../table-api';
import { MaterialMenuItemComponent } from '../material-menu-item/material-menu-item.component';

export interface MaterialRowOptionConfig {
    items: MaterialMenuItem[];
}

@Component({
    selector: 'lib-material-row-options',
    templateUrl: './material-row-options.component.html',
    styleUrls: ['./material-row-options.component.scss']
})
export class MaterialRowOptionsComponent extends BaseColumnItems implements OnInit {
    constructor() {
        super();
    }

    public ngOnInit(): void {
        if (this.processRowData != undefined) {
            this.config = this.processRowData(this.rowData);
        } else if (this.config == undefined) {
            throw ('MUST SET MATERIAL ROW OPTION CONFIG FOR COL IDX ' + this.colIdx);
        }
    }

    public onChangeEvent(event: BaseTableEvent) {
        this.onEvent.emit(event);
    }
}
