import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';


@Component({
    selector: 'lib-base-display-info',
    templateUrl: './base-display-info.component.html',
    styleUrls: ['./base-display-info.component.scss']
})
export class BaseDisplayInfoComponent implements OnInit {
    private _sub: Subscription = new Subscription();

    @Input() public config: DisplayInfoConfig;

    constructor() { }

    ngOnInit(): void {
    }

}
