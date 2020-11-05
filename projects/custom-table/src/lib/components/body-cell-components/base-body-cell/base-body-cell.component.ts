import { Component, OnInit, Input, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseTableComponent } from '../../base-table/base-table.component';

@Component({
  selector: 'app-base-body-cell',
  templateUrl: './base-body-cell.component.html',
  styleUrls: ['./base-body-cell.component.scss']
})
export class BaseBodyCellComponent implements OnInit, OnDestroy {
  protected _subs: Subscription[] = [];

  // These will be set by the base table api and will be overwritten if set
  @Input() public rowData: any;
  @Input() public colIdx: number;
  @Input() public rowIdx: number;
  @Input() public onColumnFilterEvent: EventEmitter<any>;
  @Input() public baseTable: BaseTableComponent;
  
  @Output() public onBodyCellEvent: EventEmitter<any>;

  // These should be set by user through column api
  @Input() public config: any;
  @Input() public processRowData: (rowData: any)=> any;

  constructor() { }

  public ngOnInit(): void {
    
  }

  public onChangeEvent(event: any){
    this.onBodyCellEvent.emit(event)
  }

  public ngOnDestroy(){
    this._subs.forEach(item => {
      item.unsubscribe()
    })

    this._subs = null;
  }
}
