import { Component, OnInit } from '@angular/core';
import { BaseTableComponent } from '../../../components/table/base-table/base-table.component';
import { BaseDisplayItemComponent } from '../../../components/table/base-display-item/base-display-item.component';
import { MaterialTableComponent } from '../../material/material-table/material-table.component';

@Component({
    selector: 'lib-material-expand-row',
    templateUrl: './material-expand-row.component.html',
    styleUrls: ['./material-expand-row.component.scss']
})
export class MaterialExpandRowComponent extends BaseDisplayItemComponent implements OnInit {
    public expand: boolean = false;

    constructor() { super() }

    public ngOnInit(): void {
    }

    public onClick() {
        const table: MaterialTableComponent = this.componentRef;

        if (this.expand) {
            this.expand = false
            table.rowCollapse(this.rowIdx);
        } else {
            this.expand = true
            table.rowExpand(this.rowIdx);
        }
    }
}
