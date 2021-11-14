import { Component, Input, OnInit } from '@angular/core';
import { DisplayFormat } from '../../../../table-api';

// TabPanelHeaderConfig is config used for TabPanelHeaderComponent component
export interface TabPanelHeaderConfig {
    // displayItem is the text that will be displayed with options to be able to style it
    displayItem: DisplayFormat;

    // leftIcon is class 
    leftIcon?: string;

    rightIcon?: string;
}

// TabPanelHeaderComponent is component to be used in a tab panel header
// of a tab view
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
