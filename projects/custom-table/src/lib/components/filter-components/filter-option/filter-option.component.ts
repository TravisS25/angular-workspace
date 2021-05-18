import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ChangeDetectorRef, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';
import { SelectItem } from 'primeng/api';
import { RadioButton } from 'primeng/radiobutton';
import { BaseTableEventConfig } from '../../../table-api'

// FilterConfig is config used to determine what icon will be displayed
// with FilterConfig#type along with values that will be displayed
export interface FilterConfig{
  // type determines the icon that will be displayed
  type: 'textInput' | 'date',

  // options determines what list of values will be displayed for filter
  // along with ability to select default value
  options: FilterOptions;
}

// FilterOptions display filter options and ability to choose default option
export interface FilterOptions{
  // values is list of values to display
  values: SelectItem[];
  
  // selectValue is default value selected 
  selectedValue: any
}

@Component({
  selector: 'app-filter-option',
  templateUrl: './filter-option.component.html',
  styleUrls: ['./filter-option.component.scss']
})
export class FilterOptionComponent implements OnInit {
  public value: any;
  @Input() public config: FilterConfig
  @Output() public onChange: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('op', {static: false}) public op: OverlayPanel
  @ViewChildren(RadioButton) public radioButtons: QueryList<RadioButton>;

  constructor(
    public cdr: ChangeDetectorRef
  ) { }

  public ngOnInit(): void {
    // console.log('filter config')
    // console.log(this.config);
  }

  public ngAfterViewInit(){
    this.radioButtons.forEach(item => {
      if(item.value == this.config.options.selectedValue){
        this.value = item.value;
      }
    })

    this.cdr.detectChanges();
  }

  public click(event){
    console.log('radio')
    this.onChange.emit(this.value);
  }
}
