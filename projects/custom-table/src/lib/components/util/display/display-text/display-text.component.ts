import { Component, Input, OnInit } from '@angular/core';
import { BaseDisplayItemComponent } from '../../../table/base-display-item/base-display-item.component';
import { BaseMobileDisplayItemComponent } from '../../../../components/table/mobile/base-mobile-display-item/base-mobile-display-item.component';
import { BaseDisplayTextConfig } from '../base-display-text/base-display-text.component';


@Component({
    selector: 'lib-display-text',
    templateUrl: './display-text.component.html',
    styleUrls: ['./display-text.component.scss']
})
export class DisplayTextComponent extends BaseDisplayItemComponent implements OnInit {
    constructor() { super() }

    public ngOnInit(): void {

    }
}
