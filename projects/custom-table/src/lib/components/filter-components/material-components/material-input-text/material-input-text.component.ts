import { Component, OnInit } from '@angular/core';
import { BaseColumnFilterItems } from '../../../../table-api';
import { FilterConfig } from '../../filter-option/filter-option.component';
import { InputTextComponent } from '../../input-text/input-text.component';

@Component({
  selector: 'lib-material-input-text',
  templateUrl: './material-input-text.component.html',
  styleUrls: ['./material-input-text.component.scss']
})
export class MaterialInputTextComponent extends InputTextComponent implements OnInit {

  constructor() { 
    super()
  }

  public ngOnInit(): void {
    super.ngOnInit();
  }

}
