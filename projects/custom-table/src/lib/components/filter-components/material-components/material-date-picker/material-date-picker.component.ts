import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { BaseColumnFilterItems } from '../../../../table-api'
import { FilterConfig, FilterOptions } from '../../filter-option/filter-option.component';
import * as moment from 'moment';
import { DefaultConsts } from '../../../../config';

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
    filterOptions: FilterOptions;
}


@Component({
    selector: 'lib-material-date-picker',
    templateUrl: './material-date-picker.component.html',
    styleUrls: ['./material-date-picker.component.scss']
})
export class MaterialDatePickerComponent extends BaseColumnFilterItems implements OnInit {

    constructor() {
        super()
    }

    private initConfig(){
        this.selectedValue = null;

        if(this.config == undefined || this.config == null){
            throw('MUST SET MATERILA DATE PICKER CONFIG');
        } else{
            let cfg: MaterialDatePickerConfig = this.config;

            if(cfg.filterOptions == undefined || cfg.filterOptions == null){
                throw('CONFIG MUST BE MATERIAL DATE PICKER CONFIG')
            }

            if(cfg.dateLabel == undefined){
                cfg.dateLabel = '--Date--';
            }
            if(cfg.style == undefined){
                cfg.style = {'width': '80%'};
            }
            if(cfg.disableInput == undefined){
                cfg.disableInput = true;
            }
            if(cfg.disableIcon == undefined){
                cfg.disableIcon = false;
            }

            this.config = cfg;
        }
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.initConfig();
    }

    public clear(){
        this.selectedValue = null;
        this.emitChange(this.selectedValue);
    }

    public onChangeEvent(event: MatDatepickerInputEvent<any, any>){
        console.log('change event val')
        console.log(this.selectedValue)

        if(this.selectedValue == null){
            this.emitChange(null)
        } else{
            this.emitChange(moment(this.selectedValue).format(DefaultConsts.DateFormat))
        }
    }
}
