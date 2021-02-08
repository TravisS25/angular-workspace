import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { BaseBodyCellItems, Column, FilterDescriptor } from '../../../table-api';
import { RowToggler } from 'primeng/table';

@Component({
  selector: 'app-table-expansion',
  templateUrl: './table-expansion.component.html',
  styleUrls: ['./table-expansion.component.scss']
})
export class TableExpansionComponent extends BaseBodyCellItems implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(RowToggler, {static: false}) public toggler: RowToggler;

  public expanded: boolean = false;

  constructor() {
    super()
  }

  private initEvents(){
    this._subs.push(
      this.onColumnFilterEvent.subscribe(r => {
        this.expanded = false;
        
        if(this.toggler.dt.isRowExpanded(this.rowData)){
          this.toggler.dt.toggleRow(this.rowData);
        }
      })
    )
    this._subs.push(
      this.onTableFilterEvent.subscribe(r => {
        this.expanded = false;
        
        if(this.toggler.dt.isRowExpanded(this.rowData)){
          this.toggler.dt.toggleRow(this.rowData);
        }
      })
    );
    this._subs.push(
      this.onClearFiltersEvent.subscribe(r => {
        this.expanded = false;
        
        if(this.toggler.dt.isRowExpanded(this.rowData)){
          this.toggler.dt.toggleRow(this.rowData);
        }
      })
    )
  }

  public ngOnInit(): void {
    //this.initEvents();
  }

  public ngAfterViewInit(){
    this.initEvents();
    this._subs.push(
      this.toggler.dt.onRowExpand.subscribe(r => {
        if(r.data.id == this.rowData.id){
          this.expanded = true;
        }
  
        //console.log('detect row expand');
      })
    );

    this.toggler.dt.onRowCollapse.subscribe(r => {
      //console.log('detect row collapse');
      if(r.data.id == this.rowData.id){
        this.expanded = false;
      }
    })
  }

  public ngOnDestroy(){
    this._subs.forEach(item => {
      item.unsubscribe();
    })
    this._subs = null;
  }
}
