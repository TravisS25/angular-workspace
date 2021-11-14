import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseDisplayInfoActionComponent } from '../../util/display/base-display-info-action/base-display-info-action.component';
import { MaterialButton } from '../material-config';

// MaterialDisplayActionConfig is config for MaterialDisplayActionComponent
export interface MaterialDisplayActionConfig {
    // approveBtn is config for approve button
    approveBtn: MaterialButton;

    // denyBtn is config for deny button
    denyBtn: MaterialButton;
}

// MaterialDisplayActionComponent is component used to display action buttons
// for the DisplayInfoComponent with material styling
@Component({
    selector: 'lib-material-display-action',
    templateUrl: './material-display-action.component.html',
    styleUrls: ['./material-display-action.component.scss']
})
export class MaterialDisplayActionComponent extends BaseDisplayInfoActionComponent implements OnInit {
    @Input() public config: MaterialDisplayActionConfig;

    constructor() { super() }

    public ngOnInit(): void {
    }

    public onClick(btnType: string) {
        this.onEvent.emit(btnType);
    }
}
