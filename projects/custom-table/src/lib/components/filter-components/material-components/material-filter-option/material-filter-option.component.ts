import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FilterConfig, FilterOptionComponent } from '../../filter-option/filter-option.component';
import { MatRadioButton, MatRadioChange } from '@angular/material/radio'; 

@Component({
  selector: 'lib-material-filter-option',
  templateUrl: './material-filter-option.component.html',
  styleUrls: ['./material-filter-option.component.scss']
})
export class MaterialFilterOptionComponent implements OnInit {
  @Input() public config: FilterConfig
  @Output() public onChange: EventEmitter<any> = new EventEmitter<any>();
  @ViewChildren(MatRadioButton) public radioButtons: QueryList<MatRadioButton>;

  public selectedValue: any;

  constructor() { }

  public ngOnInit(): void {
    this.selectedValue = this.config.options.selectedValue;
  }

  public radioChange(event: MatRadioChange){
    console.log('radio')
    this.onChange.emit(event.value);
  }
}
