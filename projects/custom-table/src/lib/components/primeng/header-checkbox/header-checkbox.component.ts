import { Component, OnInit, ComponentFactoryResolver, ChangeDetectorRef, ViewChild, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Checkbox } from 'primeng/checkbox';
import { CheckboxEvent } from '../../../table-api';
import { BaseTableComponent } from '../../table/base-table/base-table.component';
import { BaseColumnFilterComponent } from '../../table/base-column-filter/base-column-filter.component';

@Component({
    selector: 'app-header-checkbox',
    templateUrl: './header-checkbox.component.html',
    styleUrls: ['./header-checkbox.component.scss']
})
export class HeaderCheckboxComponent extends BaseColumnFilterComponent implements OnInit, OnDestroy {
    public checked: boolean = false;

    constructor(
        public cfr: ComponentFactoryResolver,
        public cdr: ChangeDetectorRef,
    ) {
        super();
    }

    private initConfig() {
        if (this.config == undefined) {
            throw ('MUST SET CONFIG FOR HEADER CHECKBOX');
        }

        this.excludeFilter = true;
    }

    private initProcessEvents() {
        // this.processTableFilterEvent = (event: any, baseTable: BaseTableComponent) => {
        //     this.checked = false
        // }
        // this.processTableCellEvent = (event: BaseTableEvent, baseTable: BaseTableComponent) => {
        //     let cfg = event.event as CheckboxEvent;

        //     if (!cfg.checked) {
        //         this.checked = false;
        //     }
        // }
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.initConfig();
        this.initProcessEvents();
    }

    public onChangeEvent(event: any) {
        let cbe: CheckboxEvent = {
            colIdx: this.colIdx,
            checked: event.checked,
            rowData: this.rowData,
            isHeaderCheckbox: true,
        }
        this.onEvent.emit({
            event: cbe
        })
    }
}
