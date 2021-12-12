import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BaseComponent } from '../../base/base.component';
import { BaseDisplayItemComponent } from '../../../components/table/base-display-item/base-display-item.component';
import { MaterialButton } from '../material-config';

// MaterialDisplayActionConfig is config for MaterialDisplayActionComponent
export interface MaterialDisplayActionConfig {
    // approveBtn is config for approve button
    approveBtn: MaterialButton;

    // denyBtn is config for deny button
    denyBtn: MaterialButton;
}

// MaterialDisplayActionEvent is the event interface that is emitted
// when a button is clicked
export interface MaterialDisplayActionEvent {
    btnType: 'approve' | 'deny',
}

// MaterialDisplayActionComponent is component used to display action buttons
// for the DisplayInfoComponent with material styling
@Component({
    selector: 'lib-material-display-action',
    templateUrl: './material-display-action.component.html',
    styleUrls: ['./material-display-action.component.scss']
})
export class MaterialDisplayActionComponent extends BaseComponent implements OnInit, OnDestroy {
    @Input() public config: MaterialDisplayActionConfig;

    constructor() { super() }

    private initSubs() {
        if (this.processEvent != undefined) {
            this._sub.add(
                this.onEvent.subscribe(r => {
                    this.processEvent(r, this);
                })
            )
        }
    }

    public ngOnInit(): void {
        this.initSubs();
    }

    public onClick(btnType: 'approve' | 'deny') {
        const e: MaterialDisplayActionEvent = {
            btnType: btnType,
        }
        this.onEvent.emit({
            event: e
        });
    }

    public ngOnDestroy() {
        this._sub.unsubscribe()
        this._sub = null;
    }
}
