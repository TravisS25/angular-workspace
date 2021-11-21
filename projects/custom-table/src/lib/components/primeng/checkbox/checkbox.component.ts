import { Component, OnInit, ComponentFactoryResolver, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CheckboxEvent } from '../../../table-api';
import { BaseTableComponent } from '../../table/base-table/base-table.component';
import { BaseColumnFilterComponent } from '../../table/base-column-filter/base-column-filter.component';

@Component({
    selector: 'app-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent extends BaseColumnFilterComponent implements OnInit {
    public checked: boolean = false;

    constructor() {
        super()
    }

    private initProcessEvents() {
        // this.processTableFilterEvent = (event: any, baseTable: BaseTableComponent) => {
        //     this.checked = false;
        // }
        // this.processColumnFilterEvent = (e: BaseTableEvent, baseTable: BaseTableComponent) => {
        //     if (!this.isColumnFilter) {
        //         let cfg = e.event as CheckboxEvent

        //         if (cfg.checked) {
        //             this.checked = true
        //         } else {
        //             this.checked = false
        //         }
        //     }
        // }
        // this.processTableCellEvent = (e: BaseTableEvent, baseTable: BaseTableComponent) => {
        //     if (this.isColumnFilter) {
        //         let cfg = e.event as CheckboxEvent

        //         if (!cfg.checked) {
        //             this.checked = false;
        //         }
        //     }
        // }
    }

    private initConfig() {
        if (this.config == undefined) {
            throw ('MUST SET CONFIG FOR CHECKBOX')
        }
    }

    public ngOnInit(): void {
        this.initConfig();
        this.initProcessEvents();
    }

    public onChangeEvent(event: any) {
        //console.log(event);

        let cbe: CheckboxEvent = {
            colIdx: this.colIdx,
            rowIdx: this.rowIdx,
            checked: event.checked,
            rowData: this.rowData,
            isHeaderCheckbox: false,
        }

        this.onEvent.emit({
            event: cbe
        });
    }
}
