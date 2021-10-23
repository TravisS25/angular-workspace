import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatRadioButton, MatRadioChange, MatRadioGroup } from '@angular/material/radio';
import { MatMenu } from '@angular/material/menu';
import { FormControl } from '@angular/forms';
import { SelectItem } from 'primeng';

@Component({
    selector: 'lib-material-filter-option',
    templateUrl: './material-filter-option.component.html',
    styleUrls: ['./material-filter-option.component.scss']
})
export class MaterialFilterOptionComponent implements OnInit, AfterViewInit {
    @ViewChild(MatRadioGroup) radioGroup: MatRadioGroup;
    @ViewChild(MatMenu) public menu: MatMenu;
    @Input() public selectedValue: string;
    @Input() public options: SelectItem[];
    @Output() public onChange: EventEmitter<any> = new EventEmitter<any>();
    @ViewChildren(MatRadioButton) public radioButtons: QueryList<MatRadioButton>;

    constructor(public cdr: ChangeDetectorRef) { }

    public ngOnInit(): void {
        //this.selectedValue = this.config.selectedValue;
    }

    public ngAfterViewInit() {
        this.cdr.detectChanges();
    }

    public radioChange(event: MatRadioChange) {
        console.log('radio')
        this.onChange.emit(event.value);
    }
}