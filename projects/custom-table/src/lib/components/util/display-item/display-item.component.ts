import { Component, OnInit } from '@angular/core';
import { BaseDisplayItem } from '../../../table-api';

export interface DisplayItemConfig {
    style?: Object;
    class?: string;
}

@Component({
    selector: 'lib-display-item',
    templateUrl: './display-item.component.html',
    styleUrls: ['./display-item.component.scss']
})
export class DisplayItemComponent extends BaseDisplayItem implements OnInit {

    constructor() { super() }

    public ngOnInit(): void {
    }

}
