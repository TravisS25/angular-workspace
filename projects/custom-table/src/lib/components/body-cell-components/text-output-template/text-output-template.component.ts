import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { BaseColumnItems, BaseTableEvent } from '../../../table-api';
@Component({
    selector: 'lib-text-output-template',
    templateUrl: './text-output-template.component.html',
    styleUrls: ['./text-output-template.component.scss']
})
export class TextOutputTemplateComponent extends BaseColumnItems implements OnInit {
    public label: string;

    constructor() {
        super();
    }

    public ngOnInit(): void {
        if (this.processRowData == undefined) {
            throw ('MUST SET "processRowData" FUNCTION FOR COLUMN IDX ' + this.colIdx);
        }

        this.label = this.processRowData(this.rowData);
    }

}
