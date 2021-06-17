import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseColumnFilterItems } from '../../../../table-api';
import { FilterConfig, FilterOptions } from '../../filter-option/filter-option.component';
import { InputTextComponent } from '../../input-text/input-text.component';
import { IConfig } from 'ngx-mask';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
    private _cfg: MaterialInputTextConfig;
    public modelChanged: Subject<string> = new Subject<string>();
    protected modelChangeSubscription: Subscription;

    constructor() {
        super();
    }

    protected initConfig() {
        if (this.config == undefined || this.config == null) {
            throw ('MUST SET INPUT TEXT CONFIG FOR COLUMN INDEX ' + this.colIdx);
        } else {
            this._cfg = this.config;

            if (this._cfg.filterOptions == undefined || this._cfg.filterOptions == null) {
                throw ('CONFIG MUST BE INPUT TEXT CONFIG FOR COLUMN INDEX ' + this.colIdx);
            }

            if (this._cfg.style == undefined) {
                this._cfg.style = { 'width': '80%' };
            }
            if (this._cfg.placeHolder == undefined) {
                this._cfg.placeHolder = '';
            }
            if (this._cfg.inputDebounceTime == undefined || this._cfg.inputDebounceTime <= 0) {
                this._cfg.inputDebounceTime = 500;
            }

            let mCfg: MaskConfig = {
                maskTemplate: '',
                specialCharacters: [],
                patterns: {},
                prefix: '',
                suffix: '',
                thousandSeparator: ' ',
                decimalMarker: '.',
                dropSpecialCharacters: null,
                hiddenInput: null,
                showMaskTyped: null,
                placeHolderCharacter: null,
                shownMaskExpression: null,
                showTemplate: null,
                clearIfNotMatch: null,
                validation: null,
                separatorLimit: null,
                allowNegativeNumbers: null,
                leadZeroDateTime: null
            }

            if (this._cfg.maskCfg == undefined) {
                this._cfg.maskCfg = mCfg;
            } else {
                if (!this._cfg.maskCfg.specialCharacters) {
                    this._cfg.maskCfg.specialCharacters = mCfg.specialCharacters
                }
                if (!this._cfg.maskCfg.patterns) {
                    this._cfg.maskCfg.patterns = mCfg.patterns
                }
                if (!this._cfg.maskCfg.prefix) {
                    this._cfg.maskCfg.prefix = mCfg.prefix
                }
                if (!this._cfg.maskCfg.suffix) {
                    this._cfg.maskCfg.suffix = mCfg.suffix
                }
                if (!this._cfg.maskCfg.thousandSeparator) {
                    this._cfg.maskCfg.thousandSeparator = mCfg.thousandSeparator
                }
                if (!this._cfg.maskCfg.decimalMarker) {
                    this._cfg.maskCfg.decimalMarker = mCfg.decimalMarker
                }
                if (this._cfg.maskCfg.dropSpecialCharacters == undefined) {
                    this._cfg.maskCfg.dropSpecialCharacters = mCfg.dropSpecialCharacters
                }
                if (this._cfg.maskCfg.hiddenInput == undefined) {
                    this._cfg.maskCfg.hiddenInput = mCfg.hiddenInput
                }
                if (!this._cfg.maskCfg.showMaskTyped == undefined) {
                    this._cfg.maskCfg.showMaskTyped = mCfg.showMaskTyped
                }
                if (!this._cfg.maskCfg.placeHolderCharacter) {
                    this._cfg.maskCfg.placeHolderCharacter = mCfg.placeHolderCharacter
                }
                if (!this._cfg.maskCfg.shownMaskExpression) {
                    this._cfg.maskCfg.shownMaskExpression = mCfg.shownMaskExpression
                }
                if (this._cfg.maskCfg.showTemplate == undefined) {
                    this._cfg.maskCfg.showTemplate = mCfg.showTemplate
                }
                if (this._cfg.maskCfg.clearIfNotMatch == undefined) {
                    this._cfg.maskCfg.clearIfNotMatch = mCfg.clearIfNotMatch
                }
                if (this._cfg.maskCfg.validation == undefined) {
                    this._cfg.maskCfg.validation = mCfg.validation
                }
                if (!this._cfg.maskCfg.separatorLimit) {
                    this._cfg.maskCfg.separatorLimit = mCfg.separatorLimit
                }
                if (this._cfg.maskCfg.allowNegativeNumbers == undefined) {
                    this._cfg.maskCfg.allowNegativeNumbers = mCfg.allowNegativeNumbers
                }
                if (this._cfg.maskCfg.leadZeroDateTime == undefined) {
                    this._cfg.maskCfg.leadZeroDateTime = mCfg.leadZeroDateTime
                }
            }

            this.config = this._cfg;
            console.log('config')
            console.log(this.config)
        }
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.initConfig()
        this.operator = 'contains';
        this.modelChangeSubscription = this.modelChanged
            .pipe(
                debounceTime(this._cfg.inputDebounceTime),
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
