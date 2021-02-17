import { Component, Directive, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { SelectItem } from 'primeng';
import { BaseColumnFilterItems } from '../../../../table-api';

@Directive({
    selector: '[matOptionDirective]'
})
class MatOptionDirective {
    constructor(public viewContainerRef: MatOption) { }
}

export interface GroupSelect{
    groupName: string
    disabled?: boolean;
    subgroups: SelectItem[];
}

export interface MaterialDropdownSelectConfig {
    multipleSelect?: boolean;
    selectAllLabel?: string;
    style?: Object;
    label?: string;
    isGroupSelect?: boolean;
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
            this.cfg = {
                multipleSelect: false,
                selectAllLabel: 'Select All',
            };
        } else {
            this.cfg = this.config;
        }
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.initConfig();
    }

    public toggle() {
        console.log('toggle');
        if (this.selectAll && this.selectAll.selected) {
            this.selectAll.deselect();
        } else if (this.selectedValue && this.selectedValue.length == this.value.length) {
            this.selectAll.select();
        }
        this.onChangeEvent(null);
    }
    public toggleAll() {
        this.options.forEach(x => {
            if (this.selectAll.selected) {
                x.viewContainerRef.deselect();
            } else {
                x.viewContainerRef.select();
            }
        })

        this.onChangeEvent(null);
    }
}
