import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../../base/base.component';

export interface PrimengTabPanelHeaderConfig {
    text: string;

    leftIcon?: string;

    rightIcon?: string;
}

@Component({
    selector: 'lib-primeng-tab-panel-header',
    templateUrl: './primeng-tab-panel-header.component.html',
    styleUrls: ['./primeng-tab-panel-header.component.scss']
})
export class PrimengTabPanelHeaderComponent implements OnInit {
    @Input() public config: PrimengTabPanelHeaderConfig;

    constructor() { }

    public ngOnInit(): void {
    }

}
