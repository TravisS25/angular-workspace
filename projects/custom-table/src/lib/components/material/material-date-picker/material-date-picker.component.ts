import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';
import { DefaultConsts } from '../../../table-api';
import { MaterialFilterOptionComponent } from '../material-filter-option/material-filter-option.component';
import { SelectItem } from 'primeng';
import { BaseColumnFilterComponent } from '../../table/base-column-filter/base-column-filter.component';

// MaterialDatePickerConfig is config for MaterialDatePickerComponent component
export interface MaterialDatePickerConfig {
    // dateLabel is label used for date input
    //
    // Default: --Date--
    dateLabel?: string;

    // disableInput disables from user entering characters into input
    //
    // Default: true
    disableInput?: boolean;

    // disableIcon disables user from activating calender pop up
    //
    // Default: false
    disableIcon?: boolean;

    // style is object style for the element
    //
    // Default {width: '80%'}
    style?: Object;

    // filterCfg is config used to determine filter options for date picker component
    filterOptions?: SelectItem[];
}

@Component({
    selector: 'lib-material-date-picker',
    templateUrl: './material-date-picker.component.html',
    styleUrls: ['./material-date-picker.component.scss']
})
export class MaterialDatePickerComponent extends BaseColumnFilterComponent implements OnInit {
    @Input() public config: MaterialDatePickerConfig

    @ViewChild(MaterialFilterOptionComponent) public filterOption: MaterialFilterOptionComponent;

    constructor() {
        super()
    }

    private initConfig() {
        this.selectedValue = null;

        if (this.config == undefined || this.config == null) {
            throw ('MUST SET MATERIAL DATE PICKER CONFIG');
        } else {
            if (this.config.filterOptions == undefined || this.config.filterOptions == null) {
                throw ('CONFIG MUST BE MATERIAL DATE PICKER CONFIG')
            }

            if (this.config.dateLabel == undefined) {
                this.config.dateLabel = '--Date--';
            }
            if (this.config.style == undefined) {
                this.config.style = { 'width': '70%' };
            }
            if (this.config.disableInput == undefined) {
                this.config.disableInput = true;
            }
            if (this.config.disableIcon == undefined) {
                this.config.disableIcon = false;
            }
        }
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.initConfig();
    }

    public clear() {
        this.selectedValue = null;

        if (this.operator == 'isnull' || this.operator == 'isnotnull') {
            this.filterOption.selectedValue = 'eq';
            this.operator = 'eq';
        }

        this.emitFilterChange(this.selectedValue);
    }

    public onChangeEvent(event: MatDatepickerInputEvent<any, any>) {
        if (this.selectedValue) {
            this.selectedValue = moment(this.selectedValue).format(DefaultConsts.DateFormat);
        }

        this.emitFilterChange(this.selectedValue)
    }
}
