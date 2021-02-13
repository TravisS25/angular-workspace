import { Component, OnInit } from '@angular/core';
import { BaseColumnFilterItems } from '../../../../table-api';
import { FilterConfig, FilterOptions } from '../../filter-option/filter-option.component';
import { InputTextComponent } from '../../input-text/input-text.component';

export interface MaterialInputTextConfig {
    // Inline style of the component.
    //
    // Default: {'width': '80%'}
    style?: Object;

    label?: string;

    placeHolder?: string;

    // filterCfg is config used to determine filter options for input component
    filterOptions?: FilterOptions;
}

@Component({
    selector: 'lib-material-input-text',
    templateUrl: './material-input-text.component.html',
    styleUrls: ['./material-input-text.component.scss']
})
export class MaterialInputTextComponent extends InputTextComponent implements OnInit {
    constructor() {
        super()
    }

    protected initConfig(){
        if (this.config == undefined || this.config == null) {
            throw ('MUST SET INPUT TEXT CONFIG');
        } else {
            let cfg: MaterialInputTextConfig = this.config;

            if (cfg.filterOptions == undefined || cfg.filterOptions == null) {
                throw ('CONFIG MUST BE INPUT TEXT CONFIG');
            }

            if (cfg.style == undefined) {
                cfg.style = { 'width': '80%'};
            }
            if (cfg.placeHolder == undefined) {
                cfg.placeHolder = '';
            }
        }
    }

    public ngOnInit(): void {
        super.ngOnInit();
    }

}
