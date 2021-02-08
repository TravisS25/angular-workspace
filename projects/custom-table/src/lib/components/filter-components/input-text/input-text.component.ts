import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter, ElementRef, Input, ComponentFactoryResolver, ChangeDetectorRef, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { BaseColumnFilterItems } from '../../../table-api';
import { FilterConfig } from '../filter-option/filter-option.component';

// InputTextConfig is config for InputTextComponent
export interface InputTextConfig {
    // Inline style of the component.
    //
    // Default: {'width': '80%'}
    style?: Object;

    // inputType is type of input
    //
    // Default: text
    inputType?: string;

    label?: string;

    placeHolder?: string;

    // filterCfg is config used to determine filter options for input component
    filterCfg?: FilterConfig;
}

@Component({
    selector: 'app-input-text',
    templateUrl: './input-text.component.html',
    styleUrls: ['./input-text.component.scss']
})
export class InputTextComponent extends BaseColumnFilterItems implements OnInit, OnDestroy {
    public modelChanged: Subject<string> = new Subject<string>();
    protected modelChangeSubscription: Subscription;

    constructor() {
        super();
    }

    private initValues() {
        if (this.config == undefined || this.config == null) {
            throw ('MUST SET INPUT TEXT CONFIG');
        } else {
            let cfg: InputTextConfig = this.config;

            if (cfg.filterCfg == undefined || cfg.filterCfg == null) {
                throw ('CONFIG MUST BE INPUT TEXT CONFIG');
            }

            if (cfg.style == undefined) {
                cfg.style = { 'width': '80%' };
            }
            if (cfg.inputType == undefined) {
                cfg.inputType = 'text';
            }
            if (cfg.placeHolder == undefined) {
                cfg.placeHolder = '';
            }
        }
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.initValues()
        this.operator = 'contains';
        this.modelChangeSubscription = this.modelChanged
            .pipe(
                debounceTime(500),
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
