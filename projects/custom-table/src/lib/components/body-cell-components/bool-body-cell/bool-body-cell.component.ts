import { Component, OnInit, Input } from '@angular/core';
import { BaseBodyCellItems } from '../../../table-api';

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
