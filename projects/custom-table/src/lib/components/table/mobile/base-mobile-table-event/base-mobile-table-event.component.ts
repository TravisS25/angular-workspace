import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseTableEvent } from '../../../../table-api';
import { BaseComponent } from '../../../base/base.component';
import { BaseEventComponent } from '../../base-event/base-event.component';

@Component({
    selector: 'lib-base-mobile-table-event',
    templateUrl: './base-mobile-table-event.component.html',
    styleUrls: ['./base-mobile-table-event.component.scss']
})
export abstract class BaseMobileTableEventComponent extends BaseEventComponent implements OnInit {
    constructor() { super() }

    public ngOnInit(): void {
    }

    // processTitlePanelEvent will process any event that comes from
    // mobile panel title section
    @Input() public processTitlePanelEvent: (event: any, componentRef: any) => void;

    // processDescriptionPanelEvent will process any event that comes from
    // mobile panel description section
    @Input() public processDescriptionPanelEvent: (event: any, componentRef: any) => void;
}
