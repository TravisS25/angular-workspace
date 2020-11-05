import { Component, OnInit, ComponentFactoryResolver, ChangeDetectorRef, ViewChild, OnDestroy } from '@angular/core';
import { BaseColumnFilterComponent } from '../base-column-filter/base-column-filter.component';
import { HttpClient } from '@angular/common/http';
import { Checkbox } from 'primeng/checkbox';
import { CheckboxConfig } from '../../body-cell-components/checkbox/checkbox.component';
import { BaseColumnFilterItems } from '../../../table-api';

@Component({
  selector: 'app-header-checkbox',
  templateUrl: './header-checkbox.component.html',
  styleUrls: ['./header-checkbox.component.scss']
})
export class HeaderCheckboxComponent extends BaseColumnFilterItems implements OnInit, OnDestroy {
  public checked: boolean = false;

  constructor(
    public http: HttpClient,
    public cfr: ComponentFactoryResolver,
    public cdr: ChangeDetectorRef, 
  ) { 
    super();
  }

  private initTableFilterEvent(){
    this._subs.push(
      this.onTableFilterEvent.subscribe(r => {
        this.checked = false;
      })
    )
  }

  private initBodyCellEvent(){
    this._subs.push(
      this.onBodyCellEvent.subscribe(r => {
        let config = r as CheckboxConfig;
        
        if(!config.checked){
          console.log('change value')
          this.checked = false;
        }
      })
    );
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.initBodyCellEvent();
    this.initTableFilterEvent();
  }

  public onChangeEvent(event: any){
    console.log(event)

    let config: CheckboxConfig = {
      colIdx: this.colIdx,
      checked: event.checked,
      rowData: this.rowData,
      isHeaderCheckbox: false,
    }
    this.onColumnFilterEvent.emit(config)
  }
}
