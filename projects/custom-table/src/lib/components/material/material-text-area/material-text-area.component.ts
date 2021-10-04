import { Component, OnInit } from '@angular/core';
import { BaseColumnItems } from '../../../table-api';
import { MaterialInputTextConfig } from '../material-input-text/material-input-text.component';

export interface MaterialTextAreaConfig extends MaterialInputTextConfig {
    rows?: number;
}

@Component({
    selector: 'lib-material-text-area',
    templateUrl: './material-text-area.component.html',
    styleUrls: ['./material-text-area.component.scss']
})
export class MaterialTextAreaComponent extends BaseColumnItems implements OnInit {

    constructor() { super() }

    private initConfig() {
        if (this.config == undefined) {
            throw ('MUST SET PROPERTY CONFIG FOR MATERIAL TEXT AREA!')
        }

        const cfg: MaterialTextAreaConfig = this.config;

        if (cfg.rows == undefined) {
            cfg.rows = 3;
        }

        this.config = cfg;
    }

    public ngOnInit(): void {
        this.initConfig();
    }

}
