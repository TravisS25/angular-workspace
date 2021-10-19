import { Component, OnInit, ComponentFactoryResolver, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';
import { DefaultConsts } from '../../../config';
import { BaseColumn, BaseTableEvent } from '../../../table-api';
import { FilterConfig } from '../../component-config';

// DatePickerConfig is config used for date picker option
// It has a subset of options used for the <p-calender> component
// mainly styling properties
export interface DatePickerConfig {
    // showButtonBar determines whether to display today and clear buttons at the footer
    //
    // Default: true
    showButtonBar?: boolean;

    // Inline style of the component.
    //
    // Default: {'width': '80%'}
    style?: Object;

    // Inline style of the input field
    //
    // Default: {'width': '80%'}
    inputStyle?: Object;

    // When specified, prevents entering the date manually with keyboard
    //
    // Default: true
    readonlyInput?: boolean;

    // Specifies 12 or 24 hour format.
    //
    // Default: 12
    hourFormat?: '12' | '24';

    // filterCfg is config used to determine filter options for date picker component
    filterCfg?: FilterConfig;
}

export interface DatePickerEvent {
    value?: any;
}

@Component({
    selector: 'app-date-picker',
    templateUrl: './date-picker.component.html',
    styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent extends BaseColumn implements OnInit {
    constructor() {
        super();
    }

    private initConfig() {
        if (this.config == undefined || this.config == null) {
            throw ('MUST SET DATE PICKER CONFIG');
        } else {
            let cfg: DatePickerConfig = this.config;

            if (cfg.filterCfg == undefined || cfg.filterCfg == null) {
                throw ('CONFIG MUST BE DATE PICKER CONFIG');
            }

            if (cfg.hourFormat == undefined) {
                cfg.hourFormat = '12';
            }
            if (cfg.inputStyle == undefined) {
                cfg.inputStyle = { 'width': '80%' };
            }
            if (cfg.readonlyInput == undefined) {
                cfg.readonlyInput = true;
            }
            if (cfg.showButtonBar == undefined) {
                cfg.showButtonBar = true;
            }
            if (cfg.style == undefined) {
                cfg.style = { 'width': '80%' };
            }
            this.config = cfg;
        }
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.initConfig();
    }

    public onChangeEvent(event: any) {
        if (this.selectedValue) {
            this.selectedValue = moment(this.selectedValue).format(DefaultConsts.DateFormat);
        }

        if (this.isColumnFilter) {
            this.emitFilterChange(this.selectedValue)
        } else {
            let eCfg: DatePickerEvent = {
                value: this.selectedValue,
            }

            let cfg: BaseTableEvent = {
                eventType: this.field,
                event: eCfg,
            }
            this.onEvent.emit(cfg);
        }
    }
}
