import { ChangeDetectorRef, Component, Directive, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { SelectItem } from 'primeng'
import { BaseColumnItems, BaseTableEvent, BaseTableEventConfig } from '../../../table-api';
import { MatSelectChange } from '@angular/material/select';

@Directive({
    selector: '[matOptionDirective]'
})
export class MatOptionDirective {
    constructor(public viewContainerRef: MatOption) { }
}

// GroupSelect is config used to group together select items into group for select
export interface GroupSelect {
    // groupName 
    groupName: string
    disabled?: boolean;
    subgroups: SelectItem[];
}

export interface MaterialDropdownSelectConfig extends BaseTableEventConfig {
    multipleSelect?: boolean;
    selectAllLabel?: string;
    style?: Object;
    label?: string;
    isGroupSelect?: boolean;
}

export interface MaterialDropdownSelectEvent {
    isSelectAll: boolean;
}

@Component({
    selector: 'lib-material-dropdown-select',
    templateUrl: './material-dropdown-select.component.html',
    styleUrls: ['./material-dropdown-select.component.scss']
})
export class MaterialDropdownSelectComponent extends BaseColumnItems implements OnInit {
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

    public toggle() {
        let sEvent: MaterialDropdownSelectEvent = {
            isSelectAll: false
        }
        let event: BaseTableEvent = {
            eventFieldName: this.cfg.eventFieldName,
            event: sEvent,
        }

        if (this.selectAll && this.selectAll.selected) {
            this.selectAll.deselect();
        } else if (this.selectedValue && this.selectedValue.length == this.value.length) {
            this.selectAll.select();
            let vals = this.selectedValue as any[];
            this.removeNulls(vals);
        }
        this.onChangeEvent(event);
    }

    public toggleAll() {
        let sEvent: MaterialDropdownSelectEvent = {
            isSelectAll: true
        }
        let event: BaseTableEvent = {
            eventFieldName: this.cfg.eventFieldName,
            event: sEvent
        }

        this.options.forEach(x => {
            if (this.selectAll.selected) {
                x.viewContainerRef.select();
            } else {
                x.viewContainerRef.deselect();
            }
        })

        let vals = this.selectedValue as any[];
        this.removeNulls(vals);
        this.onChangeEvent(event);
    }
}
