import { Component, OnInit, ComponentFactoryResolver, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';
import { DefaultConsts } from '../../../config';
import { BaseColumnFilterItems, BaseTableEvent } from '../../../table-api';
import { FilterConfig } from '../filter-option/filter-option.component';

// DatePickerConfig is config used for date picker option
// It has a subset of options used for the <p-calender> component
// mainly styling properties
export interface DatePickerConfig extends BaseTableEvent{
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
  filterCfg: FilterConfig;
}

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent extends BaseColumnFilterItems implements OnInit {
  constructor() { 
    super();
  }

  private initValues(){
    if(this.config == undefined || this.config == null){
      throw('MUST SET DATE PICKER CONFIG');
    } else{
      let cfg: DatePickerConfig = this.config;

      if (cfg.filterCfg == undefined || cfg.filterCfg == null){
        throw('CONFIG MUST BE DATE PICKER CONFIG');
      }

      if(cfg.hourFormat == undefined){
        cfg.hourFormat = '12';
      }
      if(cfg.inputStyle == undefined){
        cfg.inputStyle = {'width': '80%'};
      }
      if(cfg.readonlyInput == undefined){
        cfg.readonlyInput = true;
      }
      if(cfg.showButtonBar == undefined){
        cfg.showButtonBar = true;
      }
      if(cfg.style == undefined){
        cfg.style = {'width': '80%'};
      }
      this.config = cfg;
    }
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.initValues();
  }

  public onChangeEvent(event: any){
    let val = null;

    if(this.selectedValue != null && this.selectedValue != undefined){
      val = moment(this.selectedValue).format(DefaultConsts.DateFormat);
    }
    
    this.emitChange(val);
  }
}
