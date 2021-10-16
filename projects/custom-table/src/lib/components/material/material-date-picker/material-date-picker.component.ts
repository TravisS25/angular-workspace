import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { BaseColumnItems } from '../../../table-api'
import { FilterConfig, FilterOptions } from '../../component-config'
import * as moment from 'moment';
import { DefaultConsts } from '../../../config';
import { MaterialFilterOptionComponent } from '../material-filter-option/material-filter-option.component';
import { SelectItem } from 'primeng';

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

export interface MaterialDatePickerEvent {
    value: any;
}


@Component({
    selector: 'lib-material-date-picker',
    templateUrl: './material-date-picker.component.html',
    styleUrls: ['./material-date-picker.component.scss']
})
export class MaterialDatePickerComponent extends BaseColumnItems implements OnInit {
    @ViewChild(MaterialFilterOptionComponent) public filterOption: MaterialFilterOptionComponent;

    constructor() {
        super()
    }

    private initConfig() {
        this.selectedValue = null;

        if (this.config == undefined || this.config == null) {
            throw ('MUST SET MATERIAL DATE PICKER CONFIG');
        } else {
            let cfg: MaterialDatePickerConfig = this.config;

            if (cfg.filterOptions == undefined || cfg.filterOptions == null) {
                throw ('CONFIG MUST BE MATERIAL DATE PICKER CONFIG')
            }

            if (cfg.dateLabel == undefined) {
                cfg.dateLabel = '--Date--';
            }
            if (cfg.style == undefined) {
                cfg.style = { 'width': '70%' };
            }
            if (cfg.disableInput == undefined) {
                cfg.disableInput = true;
            }
            if (cfg.disableIcon == undefined) {
                cfg.disableIcon = false;
            }

            this.config = cfg;
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

        // if (this.isColumnFilter) {
        //     this.emitFilterChange(this.selectedValue)
        // } else {
        //     let eCfg: MaterialDatePickerEvent = {
        //         value: this.selectedValue,
        //     }

        //     let cfg: BaseTableEvent = {
        //         eventType: this.field,
        //         event: eCfg,
        //     }
        //     this.onEvent.emit(cfg);
        // }
    }
}
