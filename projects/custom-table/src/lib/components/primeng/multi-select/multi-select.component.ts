import { Component, OnInit, Input, ViewChildren, ViewChild, Output, EventEmitter, ComponentFactoryResolver, ChangeDetectorRef } from '@angular/core';
import { MultiSelect, MultiSelectItem } from 'primeng/multiselect';
import { BaseTableEvent } from '../../../table-api';
import { BaseColumnFilterComponent } from '../../table/base-column-filter/base-column-filter.component';

export interface MultiSelectConfig {
    // Inline style of the element
    style?: Object;

    // Height of the viewport in pixels, a scrollbar is defined if height of list exceeds this value
    //
    // Default: 200px
    scrollHeight?: string;

    // Style class of the element
    styleClass?: string;

    // Decides how many selected item labels to show at most
    //
    // Default: 3
    maxSelectedLabels?: number;

    // Label to display after exceeding max selected labels
    //
    // Default: {0} items selected
    selectedItemsLabel?: string;

    // Whether to show the checkbox at header to toggle all items at once
    //
    // Default: true
    showToggleAll?: boolean;

    // Clears the filter value when hiding the dropdown
    //
    // Default: false
    resetFilterOnHide?: boolean;

    // Whether to show the header
    // 
    // Default: true
    showHeader?: boolean;

    // The default label to display for select
    //
    // Default: 'Choose'
    defaultLabel?: string;
}

export interface MultiSelectEvent {
    value?: any;
}

@Component({
    selector: 'app-multi-select',
    templateUrl: './multi-select.component.html',
    styleUrls: ['./multi-select.component.scss']
})
export class MultiSelectComponent extends BaseColumnFilterComponent {
    @ViewChild('select', { static: false }) public select: MultiSelect;

    constructor() {
        super()
    }

    private initConfig() {
        let cfg: MultiSelectConfig;

        if (this.config == undefined || this.config == null) {
            cfg = {};
        } else {
            cfg = this.config;
        }

        if (cfg.style == undefined) {
            cfg.style = { 'width': '100%' };
        }
        if (cfg.scrollHeight == undefined) {
            cfg.scrollHeight == '200px';
        }
        if (cfg.styleClass == undefined) {
            cfg.styleClass = '';
        }
        if (cfg.maxSelectedLabels == undefined) {
            cfg.maxSelectedLabels = 3;
        }
        if (cfg.selectedItemsLabel == undefined) {
            cfg.selectedItemsLabel = '{0} items selected';
        }
        if (cfg.showToggleAll == undefined) {
            cfg.showToggleAll = true;
        }
        if (cfg.resetFilterOnHide == undefined) {
            cfg.resetFilterOnHide = false
        }
        if (cfg.showHeader == undefined) {
            cfg.showHeader = true;
        }

        this.config = cfg;
    }

    public ngOnInit(): void {
        //console.log('multi init')
        super.ngOnInit();
        this.initConfig();
    }

    public clearFilter() {
        this.select.value = [];
        this.select.updateLabel();
    }

    public updateLabel(label: string) {
        this.select.updateLabel();
    }

    public onChangeEvent(val: any) {
        if (this.isColumnFilter) {
            this.emitFilterChange(val);
        } else {
            let cfg: MultiSelectEvent = {
                value: this.select.value
            }

            let event: BaseTableEvent = {
                eventType: this.field,
                event: cfg
            }
            this.onEvent.emit(event);
        }
    }
}
