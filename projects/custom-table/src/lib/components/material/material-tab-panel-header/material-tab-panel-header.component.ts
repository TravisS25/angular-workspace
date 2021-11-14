import { Component, Input, OnInit } from '@angular/core';
import { DisplayFormat } from '../../../table-api';

// MaterialTabPanelHeaderConfig is config used for MaterialTabPanelHeaderComponent component
export interface MaterialTabPanelHeaderConfig {
    // displayItem is the text that will be displayed with options to be able to style it
    displayItem: DisplayFormat;

    // leftIcon is class that will display icon on left side of text
    leftIcon?: string;

    // leftMatIcon is class that will display icon from material icon library on left side of text
    leftMatIcon?: string;

    // rightIcon is class that will display icon on right side of text
    rightIcon?: string;

    // rightMatIcon is class that will display icon from material icon library on right side of text
    rightMatIcon?: string;
}

// MaterialTabPanelHeaderComponent is component that will be used in the tab panel headers of material tab view
@Component({
    selector: 'lib-material-tab-panel-header',
    templateUrl: './material-tab-panel-header.component.html',
    styleUrls: ['./material-tab-panel-header.component.scss']
})
export class MaterialTabPanelHeaderComponent implements OnInit {
    @Input() public config: MaterialTabPanelHeaderConfig;

    constructor() { }

    ngOnInit(): void {
    }

}
