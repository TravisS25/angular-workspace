import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { BaseColumnItems, BaseTableEvent, BaseTableEventConfig } from '../../../table-api';
import { BaseTableComponent } from '../../base-table/base-table.component';

export interface TextOutputTemplateConfig extends BaseTableEventConfig {
    changeBackgroundColor?: string;
}

@Component({
    selector: 'lib-text-output-template',
    templateUrl: './text-output-template.component.html',
    styleUrls: ['./text-output-template.component.scss']
})
export class TextOutputTemplateComponent extends BaseColumnItems implements OnInit {
    public label: string;
    public bc: string;

    constructor() {
        super();
    }

    private initProcessFunctions() {
        this.processBodyCellEvent = (event: BaseTableEvent, baseTable: BaseTableComponent) => {

        }
    }

    public ngOnInit(): void {
        this.initProcessFunctions();

        if (this.processRowData == undefined) {
            throw ('MUST SET "processRowData" FUNCTION FOR COLUMN IDX ' + this.colIdx);
        }

        this.label = this.processRowData(this.rowData);
    }

}
