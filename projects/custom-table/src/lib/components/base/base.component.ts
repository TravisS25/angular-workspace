import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BaseTableEvent } from '../../table-api';
import { Subscription } from 'rxjs';

// BaseComponent is component that every component in table should inherit
@Component({
    selector: 'lib-base',
    templateUrl: './base.component.html',
    styleUrls: ['./base.component.scss']
})
export abstract class BaseComponent implements OnInit, OnDestroy {
    @Input() public processEvent: (event: any, componentRef: any) => void;
    @Output() public onEvent: EventEmitter<BaseTableEvent> = new EventEmitter();

    protected _sub: Subscription = new Subscription();

    @Input() public config: any;
    @Input() public outerData: any;
    @Input() public componentRef: any;
    @Input() public value: any;

    constructor() { }

    public ngOnInit(): void {
    }

    public ngOnDestroy() {
        this._sub.unsubscribe();
    }
}
