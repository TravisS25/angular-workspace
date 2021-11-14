import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'lib-base-display-info-action',
    templateUrl: './base-display-info-action.component.html',
    styleUrls: ['./base-display-info-action.component.scss']
})
export abstract class BaseDisplayInfoActionComponent implements OnInit {
    @Input() public config: any;
    @Input() public processOnClick: (event: any, componentRef: any) => void;
    @Output() public onEvent: EventEmitter<any> = new EventEmitter();

    constructor() { }

    ngOnInit(): void {
    }

}
