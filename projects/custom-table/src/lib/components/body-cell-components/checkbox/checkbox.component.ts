import { Component, OnInit, ComponentFactoryResolver, ChangeDetectorRef, ViewChild } from '@angular/core';
import { BaseBodyCellItems } from '../../../table-api';

export interface CheckboxConfig{
  colIdx?: number;
  rowIdx?: number;
  rowData?: any;
  checked?: boolean;
  isHeaderCheckbox?: boolean;
}

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent extends BaseBodyCellItems implements OnInit {
  public checked: boolean = false;

  constructor() {
    super()
  }

  private initColumnFilterEvent(){
    this._subs.push(
      this.onColumnFilterEvent.subscribe(r => {
        let config = r as CheckboxConfig;

        if(config.checked){
          this.checked = true
          //this.checkbox.disabled = true;
        } else{
          this.checked = false
          //this.checkbox.disabled = false;
        }
      })
    )
  }

  public ngOnInit(): void {
    this.initColumnFilterEvent();
  }

  public onChangeEvent(event: any){
    console.log(event);
    let config: CheckboxConfig = {
      colIdx: this.colIdx,
      rowIdx: this.rowIdx,
      checked: event.checked,
      rowData: this.rowData,
      isHeaderCheckbox: false,
    }
    this.onBodyCellEvent.emit(config);
  }
}
