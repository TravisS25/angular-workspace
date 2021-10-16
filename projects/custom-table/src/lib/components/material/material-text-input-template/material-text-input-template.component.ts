import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseTableEvent } from '../../../table-api';

@Component({
    selector: 'lib-material-text-input-template',
    templateUrl: './material-text-input-template.component.html',
    styleUrls: ['./material-text-input-template.component.scss']
})
export class MaterialTextInputTemplateComponent implements OnInit {
    @Output() public onEvent: EventEmitter<BaseTableEvent> = new EventEmitter();

    @Input() public isInput: boolean = true;
    @Input() public operator: string;
    @Input() public config: any;
    @Input() public selectedValue: any;
    @Input() public value: any;

    constructor() { }

    public ngOnInit(): void {
    }

    public onChangeEvent(event: any) {
        this.onEvent.emit(event);
    }
}
