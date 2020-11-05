import { Component, OnInit, Input } from '@angular/core';
import { BaseBodyCellItems } from '../../../table-api';
import { BaseBodyCellComponent } from '../base-body-cell/base-body-cell.component';

@Component({
  selector: 'app-bool-body-cell',
  templateUrl: './bool-body-cell.component.html',
  styleUrls: ['./bool-body-cell.component.scss']
})
export class BoolBodyCellComponent extends BaseBodyCellItems implements OnInit {
  constructor() {
    super();
  }

  ngOnInit(): void {
    
  }

}
