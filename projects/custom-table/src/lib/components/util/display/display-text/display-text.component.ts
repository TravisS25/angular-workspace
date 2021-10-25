import { Component, OnInit } from '@angular/core';
import { BaseMobileDisplayItemComponent } from '../../../../components/table/mobile/base-mobile-display-item/base-mobile-display-item.component';

export interface DisplayTextConfig {
    style?: Object;
    class?: string;
}

@Component({
    selector: 'lib-display-text',
    templateUrl: './display-text.component.html',
    styleUrls: ['./display-text.component.scss']
})
export class DisplayTextComponent extends BaseMobileDisplayItemComponent implements OnInit {
    constructor() { super() }

    private initValues() {
        if (this.processRowData != undefined) {
            this.processRowData(this.rowData, this);
        }
    }

    public ngOnInit(): void {
        this.initValues();
    }
}
