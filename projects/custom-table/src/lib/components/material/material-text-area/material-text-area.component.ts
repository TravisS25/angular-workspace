import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MaterialInputTextComponent } from '../material-input-text/material-input-text.component';
import { BaseColumn } from '../../../table-api';
import { MaterialInputTextConfig } from '../material-input-text/material-input-text.component';

export interface MaterialTextAreaConfig extends MaterialInputTextConfig {
    rows?: number;
}

@Component({
    selector: 'lib-material-text-area',
    templateUrl: './material-text-area.component.html',
    styleUrls: ['./material-text-area.component.scss']
})
export class MaterialTextAreaComponent extends MaterialInputTextComponent implements OnInit {
    @Input() public config: MaterialTextAreaConfig;

    constructor(public cdr: ChangeDetectorRef) { super(cdr) }

    private initCfg() {
        if (this.config.rows == undefined) {
            this.config.rows = 3;
        }
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.initCfg();
    }

}
