import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IConfig } from 'ngx-mask';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { getDefaultTextMask } from '../../../default-values';
import { BaseColumnFilterComponent } from '../../table/base-column-filter/base-column-filter.component';
import { SelectItem, MaskConfig } from '../../../table-api';

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
    filterOptions?: SelectItem[];

    // inputDebounceTime is the time in milliseconds in which input is delayed
    // to send to the server unless more input is entered
    //
    // Default: 500
    inputDebounceTime?: number;

    // maskCfg is config to set mask for input
    maskCfg?: Partial<MaskConfig>;
}

@Component({
    selector: 'lib-material-input-text',
    templateUrl: './material-input-text.component.html',
    styleUrls: ['./material-input-text.component.scss'],
})
export class MaterialInputTextComponent extends BaseColumnFilterComponent implements OnInit, AfterViewInit, OnDestroy {
    protected modelChangeSubscription: Subscription;
    protected txtChanged: Subject<string> = new Subject<string>();

    constructor(public cdr: ChangeDetectorRef) {
        super();
    }

    private initConfig() {
        if (this.isInputTemplate && this.field == undefined) {
            throw ('MUST SET PROPERTY "field" FOR INPUT TEMPLATE FOR COLUMN INDEX ' + this.colIdx)
        }

        if (this.config == undefined || this.config == null) {
            throw ('MUST SET INPUT TEXT CONFIG FOR COLUMN INDEX ' + this.colIdx);
        }

        const cfg: MaterialInputTextConfig = this.config;

        if (cfg.style == undefined) {
            cfg.style = { 'width': '80%' };
        }
        if (cfg.placeHolder == undefined) {
            cfg.placeHolder = '';
        }
        if (cfg.inputDebounceTime == undefined || cfg.inputDebounceTime <= 0) {
            cfg.inputDebounceTime = 500;
        }

        const mCfg = getDefaultTextMask();

        if (this.selectedValue == undefined) {
            console.log('undefined select value!')
            this.selectedValue = null;
        }

        if (cfg.maskCfg == undefined) {
            cfg.maskCfg = mCfg;
        } else {
            if (!cfg.maskCfg.specialCharacters) {
                cfg.maskCfg.specialCharacters = mCfg.specialCharacters
            }
            if (!cfg.maskCfg.patterns) {
                cfg.maskCfg.patterns = mCfg.patterns
            }
            if (!cfg.maskCfg.prefix) {
                cfg.maskCfg.prefix = mCfg.prefix
            }
            if (!cfg.maskCfg.suffix) {
                cfg.maskCfg.suffix = mCfg.suffix
            }
            if (!cfg.maskCfg.thousandSeparator) {
                cfg.maskCfg.thousandSeparator = mCfg.thousandSeparator
            }
            if (!cfg.maskCfg.decimalMarker) {
                cfg.maskCfg.decimalMarker = mCfg.decimalMarker
            }
            if (cfg.maskCfg.dropSpecialCharacters == undefined) {
                cfg.maskCfg.dropSpecialCharacters = mCfg.dropSpecialCharacters
            }
            if (cfg.maskCfg.hiddenInput == undefined) {
                cfg.maskCfg.hiddenInput = mCfg.hiddenInput
            }
            if (!cfg.maskCfg.showMaskTyped == undefined) {
                cfg.maskCfg.showMaskTyped = mCfg.showMaskTyped
            }
            if (!cfg.maskCfg.placeHolderCharacter) {
                cfg.maskCfg.placeHolderCharacter = mCfg.placeHolderCharacter
            }
            if (!cfg.maskCfg.shownMaskExpression) {
                cfg.maskCfg.shownMaskExpression = mCfg.shownMaskExpression
            }
            if (cfg.maskCfg.showTemplate == undefined) {
                cfg.maskCfg.showTemplate = mCfg.showTemplate
            }
            if (cfg.maskCfg.clearIfNotMatch == undefined) {
                cfg.maskCfg.clearIfNotMatch = mCfg.clearIfNotMatch
            }
            if (cfg.maskCfg.validation == undefined) {
                cfg.maskCfg.validation = mCfg.validation
            }
            if (!cfg.maskCfg.separatorLimit) {
                cfg.maskCfg.separatorLimit = mCfg.separatorLimit
            }
            if (cfg.maskCfg.allowNegativeNumbers == undefined) {
                cfg.maskCfg.allowNegativeNumbers = mCfg.allowNegativeNumbers
            }
            if (cfg.maskCfg.leadZeroDateTime == undefined) {
                cfg.maskCfg.leadZeroDateTime = mCfg.leadZeroDateTime
            }
        }

        this.config = cfg;
    }

    public ngOnInit(): void {
        super.ngOnInit();

        this.initConfig();
        this.modelChangeSubscription = this.txtChanged
            .pipe(
                debounceTime(this.config.inputDebounceTime),
                distinctUntilChanged()
            )
            .subscribe(txt => {
                this.selectedValue = txt;
                this.emitFilterChange(this.selectedValue);
            });
    }

    public ngAfterViewInit() {
        this.cdr.detectChanges()
    }

    public onChangeEvent(text: string) {
        this.txtChanged.next(text);
    }

    public ngOnDestroy() {
        super.ngOnDestroy()
        this.modelChangeSubscription.unsubscribe();
    }
}
