import { AfterViewInit, ChangeDetectorRef, Component, Directive, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { SelectItem } from 'primeng'
import { BaseColumnItems, BaseTableEvent, BaseTableEventConfig } from '../../../table-api';
import { MatSelectChange } from '@angular/material/select';
import { makeID } from '../../../util';

@Directive({
    selector: '[matOptionDirective]'
})
export class MatOptionDirective {
    constructor(public viewContainerRef: MatOption) { }
}

// GroupSelect is config used to group together select items into group for select
export interface GroupSelect {
    // groupName is the name displayed for the grouping of subgroups
    groupName: string

    // disabled will determine if a group is disabled from being selected 
    disabled?: boolean;

    // subgroups should be array of items under a group
    subgroups: SelectItem[];
}

export interface MaterialDropdownSelectConfig extends BaseTableEventConfig {
    // multipleSelect determines whether user is able to select more than
    // one option for dropdown
    multipleSelect?: boolean;

    // selectAllLabel is label for select option to has ability to select/deselect
    // all options at once
    //
    // multipleSelect must be set for this to be visible
    selectAllLabel?: string;

    // style is object for styling component
    style?: Object;

    // label is text used when nothing is selected for dropdown
    label?: string;

    // isGroupSelect determines whether dropdown will display options in groups
    // 
    // If this is set, then the value passed to component's "value" input property
    // must be instance of GroupSelect[]
    isGroupSelect?: boolean;
}

@Component({
    selector: 'lib-material-dropdown-select',
    templateUrl: './material-dropdown-select.component.html',
    styleUrls: ['./material-dropdown-select.component.scss']
})
export class MaterialDropdownSelectComponent extends BaseColumnItems implements OnInit, AfterViewInit {
    @ViewChild('selectAll') public selectAll: MatOption;
    @ViewChildren(MatOptionDirective) public options: QueryList<MatOptionDirective>;

    public cfg: MaterialDropdownSelectConfig;
    public nameField = makeID(15);

    constructor(public cdr: ChangeDetectorRef) {
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

    public ngAfterViewInit() {
        this.cdr.detectChanges();
    }

    public toggle() {
        if (this.selectAll && this.selectAll.selected) {
            this.selectAll.deselect();
        } else if (this.selectedValue && this.selectedValue.length == this.value.length) {
            this.selectAll.select();
            this.removeNulls(this.selectedValue as any[]);
        }

        this.emitFilterChange(this.selectedValue);

        // if (this.isColumnFilter) {
        //     this.emitFilterChange(this.selectedValue);
        // } else {
        //     let sEvent: MaterialDropdownSelectEvent = {
        //         isSelectAll: false
        //     }
        //     let event: BaseTableEvent = {
        //         eventFieldName: this.cfg.eventFieldName,
        //         event: sEvent,
        //     }
        //     this.onEvent.emit(event);
        // }
    }

    public toggleAll() {
        this.options.forEach(x => {
            if (this.selectAll.selected) {
                x.viewContainerRef.select();
            } else {
                x.viewContainerRef.deselect();
            }
        })

        this.removeNulls(this.selectedValue as any[]);
        this.emitFilterChange(this.selectedValue);

        // if (this.isColumnFilter) {
        //     this.emitFilterChange(this.selectedValue);
        // } else {
        //     let sEvent: MaterialDropdownSelectEvent = {
        //         isSelectAll: true
        //     }
        //     let event: BaseTableEvent = {
        //         eventFieldName: this.cfg.eventFieldName,
        //         event: sEvent
        //     }

        //     this.onEvent.emit(event);
        // }
    }
}
