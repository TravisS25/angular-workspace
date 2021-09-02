import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { BaseTableEvent } from '../../../table-api';
import { MaterialMenuItem } from '../material-row-options/material-row-options.component';

@Component({
    selector: 'lib-material-menu-item',
    templateUrl: './material-menu-item.component.html',
    styleUrls: ['./material-menu-item.component.scss']
})
export class MaterialMenuItemComponent implements OnInit {
    @Input() rowData: any;
    @Input() field: string;
    @Input() items: MaterialMenuItem[];
    @Output() onEvent: EventEmitter<any> = new EventEmitter();
    @ViewChild(MatMenu, { static: true }) public childMenu: MatMenu;

    constructor() { }

    public ngOnInit(): void {
    }

    public onChangeEvent(event: MaterialMenuItem) {
        event.rowData = this.rowData;

        let bteCfg: BaseTableEvent = {
            eventFieldName: this.field,
            event: event,
        }

        this.onEvent.emit(bteCfg)
    }
}
