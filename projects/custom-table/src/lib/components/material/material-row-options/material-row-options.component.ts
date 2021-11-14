import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MaterialMenuItem } from '../material-menu-item/material-menu-item.component';
import { Menu } from 'primeng';
import { MaterialMenuItemModule } from '../../../modules/material/material-menu-item.module';
import { BaseTableEvent, } from '../../../table-api';
import { BaseDisplayItemComponent } from '../../table/base-display-item/base-display-item.component';

// MaterialRowOptionsConfig is config for MaterialRowOptionsComponent component
export interface MaterialRowOptionsConfig {
    // items represents the menu items and child menu items
    items: MaterialMenuItem[];
}

@Component({
    selector: 'lib-material-row-options',
    templateUrl: './material-row-options.component.html',
    styleUrls: ['./material-row-options.component.scss']
})
export class MaterialRowOptionsComponent extends BaseDisplayItemComponent implements OnInit {
    @Input() public config: MaterialRowOptionsConfig;

    constructor() {
        super();
    }

    public ngOnInit(): void {
        if (this.processRowData != undefined) {
            this.processRowData(this.rowData, this);
        } else if (this.config == undefined) {
            throw ('MUST SET MATERIAL ROW OPTION CONFIG FOR COL IDX ' + this.colIdx);
        }
    }

    public onChangeEvent(event: BaseTableEvent) {
        this.onEvent.emit(event);
    }
}
