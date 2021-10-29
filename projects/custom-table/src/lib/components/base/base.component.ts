import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BaseTableEvent } from '../../table-api';
import { Subscription } from 'rxjs';

@Component({
    selector: 'lib-base',
    templateUrl: './base.component.html',
    styleUrls: ['./base.component.scss']
})
export abstract class BaseComponent implements OnInit, OnDestroy {
    protected _sub: Subscription = new Subscription();

    @Input() public config: any;
    @Input() public outerData: any;
    @Input() public componentRef: any;
    @Input() public rowIdx: number;
    @Input() public rowData: any;
    @Input() public value: any;
    @Input() public processRowData: (rowData: any, componentRef: any) => void;

    constructor() { }

    public ngOnInit(): void {
    }

    public ngOnDestroy() {
        this._sub.unsubscribe();
    }
}
