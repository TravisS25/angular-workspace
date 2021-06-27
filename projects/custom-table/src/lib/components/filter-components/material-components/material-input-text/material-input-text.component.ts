import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseColumnFilterItems } from '../../../../table-api';
import { FilterConfig, FilterOptions } from '../../filter-option/filter-option.component';
import { InputTextComponent } from '../../input-text/input-text.component';
import { IConfig } from 'ngx-mask';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { setMaterialInputTextConfig } from '../../../component-util/material-util';

export interface MaskConfig extends IConfig {
    maskTemplate: string;
}

export interface MaterialInputTextConfig {
    // Inline style of the component.
    //
    // Default: {'width': '80%'}
    style?: Object;

    // label is label displayed for input
    label?: string;

    // placeHolder is text placeholder to use for input
    placeHolder?: string;

    // filterCfg is config used to determine filter options for input component
    filterOptions?: FilterOptions;

    // inputDebounceTime is the time in milliseconds in which input is delayed
    // to send to the server unless more input is entered
    //
    // Default: 500
    inputDebounceTime?: number;

    // maskCfg is config to set mask for input
    maskCfg?: Partial<MaskConfig>;

    maskTemplate?: string;
}

@Component({
    selector: 'lib-material-input-text',
    templateUrl: './material-input-text.component.html',
    styleUrls: ['./material-input-text.component.scss']
})
export class MaterialInputTextComponent extends BaseColumnFilterItems implements OnInit, OnDestroy {
    //private _cfg: MaterialInputTextConfig;
    public modelChanged: Subject<string> = new Subject<string>();
    protected modelChangeSubscription: Subscription;

    constructor() {
        super();
    }

    public ngOnInit(): void {
        super.ngOnInit();
        setMaterialInputTextConfig(this.config, this.colIdx);
        this.operator = 'contains';
        this.modelChangeSubscription = this.modelChanged
            .pipe(
                debounceTime(this.config.inputDebounceTime),
                distinctUntilChanged()
            )
            .subscribe(txt => {
                this.selectedValue = txt;
                this.emitChange(txt);
                // console.log(txt);
            });
    }

    public changed(text: string) {
        this.modelChanged.next(text);
    }

    public ngOnDestroy() {
        super.ngOnDestroy()
        this.modelChangeSubscription.unsubscribe();
    }
}
