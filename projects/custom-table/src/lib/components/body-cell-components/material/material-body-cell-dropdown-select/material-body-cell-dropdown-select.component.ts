import { Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { BaseBodyCellItems, BaseTableEvent } from '../../../../table-api';
import { MaterialDropdownSelectConfig, MaterialDropdownSelectEvent, MatOptionDirective } from '../../../filter-components/material-components/material-dropdown-select/material-dropdown-select.component';

@Component({
    selector: 'lib-material-body-cell-dropdown-select',
    templateUrl: './material-body-cell-dropdown-select.component.html',
    styleUrls: ['./material-body-cell-dropdown-select.component.scss']
})
export class MaterialBodyCellDropdownSelectComponent extends BaseBodyCellItems implements OnInit, OnDestroy {
    @ViewChild('selectAll') public selectAll: MatOption;
    @ViewChildren(MatOptionDirective) public options: QueryList<MatOptionDirective>;

    public cfg: MaterialDropdownSelectConfig;

    constructor() {
        super();
    }

    private initConfig() {
        if (this.config == undefined) {
            throw ('MUST SET MATERIAL DROPDOWN SELECT CONFIG FOR COL IDX ' + this.colIdx);
        } else {
            this.cfg = this.config;

            if (this.cfg.selectAllLabel == undefined) {
                this.cfg.selectAllLabel = '--Select All--'
            }
        }
    }

    private removeNulls(vals: any[]): any[] {
        let i = vals.length;

        while (i--) {
            if (vals[i] == undefined || vals[i] == null) {
                vals.splice(i, 1);
            }
        }

        return vals
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.initConfig();
    }

    // public toggle() {
    //     let sEvent: MaterialDropdownSelectEvent = {
    //         isSelectAll: false
    //     }
    //     let event: BaseTableEvent = {
    //         eventFieldName: this.cfg.eventFieldName,
    //         event: sEvent,
    //     }

    //     if (this.selectAll && this.selectAll.selected) {
    //         this.selectAll.deselect();
    //     } else if (this.selectedValue && this.selectedValue.length == this.value.length) {
    //         this.selectAll.select();
    //         let vals = this.selectedValue as any[];
    //         vals = this.removeNulls(vals);
    //     }
    //     this.onChangeEvent(event);
    // }
    // public toggleAll() {
    //     let sEvent: MaterialDropdownSelectEvent = {
    //         isSelectAll: true
    //     }
    //     let event: BaseTableEvent = {
    //         eventFieldName: this.cfg.eventFieldName,
    //         event: sEvent
    //     }

    //     this.options.forEach(x => {
    //         if (this.selectAll.selected) {
    //             x.viewContainerRef.select();
    //         } else {
    //             x.viewContainerRef.deselect();
    //         }
    //     })

    //     let vals = this.selectedValue as any[];
    //     vals = this.removeNulls(vals);
    //     this.onChangeEvent(event);
    // }
}
