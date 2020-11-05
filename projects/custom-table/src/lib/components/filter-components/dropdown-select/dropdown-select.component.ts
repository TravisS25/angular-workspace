import { Component, ViewChild, ComponentFactoryResolver, ChangeDetectorRef, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseColumnFilterComponent } from '../base-column-filter/base-column-filter.component';
import { Dropdown } from 'primeng/dropdown';
import { BaseColumnFilterItems, BaseTableEvent } from '../../../table-api';
import { GalleriaThumbnails } from 'primeng';

export interface DropdownSelectConfig extends BaseTableEvent{
  // Inline style of the element
  //
  // Default: {'min-width': '100%'}
  style?: Object;

  // Style class of the element
  //
  // Default: ""
  styleClass?: string;

  // When specified, displays an input field to filter the items on keyup.
  //
  // Default: true
  filter?: boolean;
}

@Component({
  selector: 'app-dropdown-select',
  templateUrl: './dropdown-select.component.html',
  styleUrls: ['./dropdown-select.component.scss']
})
export class DropdownSelectComponent extends BaseColumnFilterItems implements OnInit {
  private initValues(){
    if(this.config != undefined){
      let cfg: DropdownSelectConfig = this.config;

      if(cfg.style == undefined){
        cfg.style = {'min-width': '100%', 'max-width': '150px'};
      }
      if(cfg.styleClass == undefined){
        cfg.styleClass = '';
      }
      if(cfg.filter == undefined){
        cfg.filter = true;
      }
    } else{
      let cfg: DropdownSelectConfig = {
        styleClass: '',
        style: {'min-width': '100%', 'max-width': '150px'},
        filter: true,
      }
      this.config = cfg;
    }
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.initValues();
  }
}
