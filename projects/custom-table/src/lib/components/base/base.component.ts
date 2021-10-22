import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BaseTableEvent } from '../../table-api';
import { Subscription } from 'rxjs';

@Component({
    selector: 'lib-base',
    templateUrl: './base.component.html',
    styleUrls: ['./base.component.scss']
})
export abstract class BaseComponent implements OnInit, OnDestroy {
    protected _subs: Subscription[] = [];

    @Input() public config: any;
    @Output() public onEvent: EventEmitter<any> = new EventEmitter();

    public processEvent: (event: BaseTableEvent, componentRef: any) => void;

    constructor() { }

    public ngOnInit(): void {
    }

    public ngOnDestroy() {
        this._subs.forEach(item => {
            item.unsubscribe()
        })
        this._subs = null;
    }
}
