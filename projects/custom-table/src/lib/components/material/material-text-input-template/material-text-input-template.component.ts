import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'lib-material-text-input-template',
    templateUrl: './material-text-input-template.component.html',
    styleUrls: ['./material-text-input-template.component.scss']
})
export class MaterialTextInputTemplateComponent implements OnInit {
    @Input() public isInput: boolean = true;
    @Input() public operator: string;
    @Input() public config: any;
    @Input() public selectedValue: any;
    @Input() public value: any;

    constructor() { }

    ngOnInit(): void {
    }

}
