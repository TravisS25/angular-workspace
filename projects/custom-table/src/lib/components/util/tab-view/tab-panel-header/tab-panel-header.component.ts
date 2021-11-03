import { Component, Input, OnInit } from '@angular/core';
import { DisplayFormat } from '../../../../table-api';

export interface TabPanelHeaderConfig {
    displayItem: DisplayFormat;

    leftIcon?: string;

    rightIcon?: string;
}

@Component({
    selector: 'lib-tab-panel-header',
    templateUrl: './tab-panel-header.component.html',
    styleUrls: ['./tab-panel-header.component.scss']
})
export class TabPanelHeaderComponent implements OnInit {
    @Input() public config: TabPanelHeaderConfig;

    constructor() { }

    ngOnInit(): void {
    }

}
