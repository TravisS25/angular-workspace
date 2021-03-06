import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FilterOptions } from '../../component-config';
import { MatRadioButton, MatRadioChange } from '@angular/material/radio';

@Component({
    selector: 'lib-material-filter-option',
    templateUrl: './material-filter-option.component.html',
    styleUrls: ['./material-filter-option.component.scss']
})
export class MaterialFilterOptionComponent implements OnInit {
    @Input() public config: FilterOptions
    @Output() public onChange: EventEmitter<any> = new EventEmitter<any>();
    @ViewChildren(MatRadioButton) public radioButtons: QueryList<MatRadioButton>;

    public selectedValue: any;

    constructor() { }

    public ngOnInit(): void {
        this.selectedValue = this.config.selectedValue;
    }

    public radioChange(event: MatRadioChange) {
        console.log('radio')
        this.onChange.emit(event.value);
    }
}
