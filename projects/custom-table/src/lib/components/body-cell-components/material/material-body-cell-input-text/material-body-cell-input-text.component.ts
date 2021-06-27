import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { BaseBodyCellItems, BaseTableEvent } from '../../../../table-api';
import { setMaterialInputTextConfig } from '../../../component-util/material-util';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'lib-material-body-cell-input-text',
    templateUrl: './material-body-cell-input-text.component.html',
    styleUrls: ['./material-body-cell-input-text.component.scss']
})
export class MaterialBodyCellInputTextComponent extends BaseBodyCellItems implements OnInit, OnDestroy {
    public modelChanged: Subject<string> = new Subject<string>();
    protected modelChangeSubscription: Subscription;

    constructor() {
        super();
    }

    public ngOnInit(): void {
        super.ngOnInit();
        setMaterialInputTextConfig(this.config, this.colIdx);
        this.modelChangeSubscription = this.modelChanged
            .pipe(
                debounceTime(this.config.inputDebounceTime),
                distinctUntilChanged()
            )
            .subscribe(txt => {
                let cfg: BaseTableEvent = {
                    eventFieldName: this.field,
                    event: txt,
                }
                this.onChangeEvent(cfg);
            });
    }

    public ngOnDestroy() {
        super.ngOnDestroy()
        this.modelChangeSubscription.unsubscribe();
    }
}
