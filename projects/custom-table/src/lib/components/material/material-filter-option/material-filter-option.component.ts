import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FilterOptions } from '../../component-config';
import { MatRadioButton, MatRadioChange } from '@angular/material/radio';
import { MatMenu } from '@angular/material/menu';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'lib-material-filter-option',
    templateUrl: './material-filter-option.component.html',
    styleUrls: ['./material-filter-option.component.scss']
})
export class MaterialFilterOptionComponent implements OnInit, AfterViewInit {
    @ViewChild(MatMenu) public menu: MatMenu;
    @Input() public config: FilterOptions
    @Output() public onChange: EventEmitter<any> = new EventEmitter<any>();
    @ViewChildren(MatRadioButton) public radioButtons: QueryList<MatRadioButton>;

    public selectedValue: any;

    constructor(public cdr: ChangeDetectorRef) { }

    public ngOnInit(): void {
        this.selectedValue = this.config.selectedValue;
    }

    public ngAfterViewInit() {
        this.cdr.detectChanges();
    }

    public radioChange(event: MatRadioChange) {
        console.log('radio')
        this.onChange.emit(event.value);
    }
}