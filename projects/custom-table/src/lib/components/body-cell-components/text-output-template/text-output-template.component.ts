import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { BaseColumnItems, } from '../../../table-api';
import { BaseTableComponent } from '../../base-table/base-table.component';

export interface TextOutputTemplateConfig {
    changeBackgroundColor?: string;
    label?: string;
}

@Component({
    selector: 'lib-text-output-template',
    templateUrl: './text-output-template.component.html',
    styleUrls: ['./text-output-template.component.scss'],
})
export class TextOutputTemplateComponent extends BaseColumnItems implements OnInit {
    public label: string;

    constructor() {
        super();
    }

    // private initProcessFunctions() {
    //     this.processInputTemplateEvent = (event: BaseTableEvent, baseTable: BaseTableComponent) => {
    //         console.log('processing input template event');
    //         this.label = this.processRowData(this.rowData);
    //     }
    // }

    public ngOnInit(): void {
        console.log('output template init');
        //this.initProcessFunctions();

        if (this.processRowData == undefined) {
            throw ('MUST SET "processRowData" FUNCTION FOR COLUMN IDX ' + this.colIdx);
        } else {
            this.label = this.processRowData(this.rowData);
            // console.log('label here')
            // console.log(this.label);
        }
    }
}
