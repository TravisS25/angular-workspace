import { Component, EventEmitter, Input, OnInit } from '@angular/core';

@Component({
    selector: 'lib-base-row-expansion',
    templateUrl: './base-row-expansion.component.html',
    styleUrls: ['./base-row-expansion.component.scss']
})
export abstract class BaseRowExpansionComponent implements OnInit {
    @Input() public config: any;
    @Input() public renderCallback: EventEmitter<any>;
    @Input() public outerData: any;

    constructor() { }

    ngOnInit(): void {
    }

}
