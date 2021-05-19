import { Component, Directive, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { SelectItem } from 'primeng';
import { BaseColumnFilterItems, BaseTableEvent, BaseTableEventConfig } from '../../../../table-api';

@Directive({
    selector: '[matOptionDirective]'
})
class MatOptionDirective {
    constructor(public viewContainerRef: MatOption) { }
}

export interface GroupSelect {
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
export class MaterialDropdownSelectComponent extends BaseColumnFilterItems implements OnInit {
    @ViewChild('selectAll') public selectAll: MatOption;
    @ViewChildren(MatOptionDirective) public options: QueryList<MatOptionDirective>;

    public cfg: MaterialDropdownSelectConfig;

    constructor() {
        super();
    }

    private initConfig() {
        if (this.config == undefined) {
            throw ('MUST SET MATERIAL DROPDOWN SELECT CONFIG');
        } else {
            this.cfg = this.config;

            if (this.cfg.selectAllLabel == undefined) {
                this.cfg.selectAllLabel = 'Select All'
            }
        }
        // if (this.config == undefined) {
        //     this.cfg = {
        //         multipleSelect: false,
        //         selectAllLabel: 'Select All',
        //     };
        // } else {
        //     this.cfg = this.config;
        // }
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
                x.viewContainerRef.deselect();
            } else {
                x.viewContainerRef.select();
            }
        })

        this.onChangeEvent(event);
    }
}
