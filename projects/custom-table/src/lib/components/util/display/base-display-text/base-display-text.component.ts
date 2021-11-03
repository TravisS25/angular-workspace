import { Component, Input, OnInit } from '@angular/core';

export interface BaseDisplayTextConfig {
    style?: Object;
    class?: string;
}

@Component({
    selector: 'lib-base-display-text',
    templateUrl: './base-display-text.component.html',
    styleUrls: ['./base-display-text.component.scss']
})
export class BaseDisplayTextComponent implements OnInit {
    @Input() public config: BaseDisplayTextConfig
    @Input() public value: any;
    @Input() public rowData: any;
    @Input() public processRowData: (rowData: any, componentRef: any) => void;

    constructor() { }

    private initValues() {
        if (this.processRowData != undefined) {
            this.processRowData(this.rowData, this);
        }
    }

    public ngOnInit(): void {
        this.initValues();
    }
}
