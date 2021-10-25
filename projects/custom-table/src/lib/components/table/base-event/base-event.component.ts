import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseTableEvent } from '../../../table-api';
import { BaseComponent } from '../../base/base.component';

@Component({
    selector: 'lib-base-event',
    templateUrl: './base-event.component.html',
    styleUrls: ['./base-event.component.scss']
})
export abstract class BaseEventComponent extends BaseComponent implements OnInit {
    @Output() public onEvent: EventEmitter<BaseTableEvent> = new EventEmitter();

    constructor() { super() }

    public ngOnInit(): void {
    }

    // processCaptionEvent will process any event that is emitted from caption of table
    @Input() processCaptionEvent: (event: any, componentRef: any) => void;

    // processPopupEvent will process any event that occurs within a popup form/display
    @Input() processPopupEvent?: (event: any, componentRef: any) => void;
}
