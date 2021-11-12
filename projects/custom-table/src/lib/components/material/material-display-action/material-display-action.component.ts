import { Component, Input, OnInit } from '@angular/core';
import { BaseDisplayItemComponent } from 'projects/custom-table/src/public-api';
import { MaterialButton } from '../material-config';

export interface MaterialDisplayActionConfig {
    approveBtn: MaterialButton;
    denyBtn: MaterialButton;
}

// MaterialDisplayActionComponent is component used to display action buttons
// for the DisplayInfoComponent with material styling
@Component({
    selector: 'lib-material-display-action',
    templateUrl: './material-display-action.component.html',
    styleUrls: ['./material-display-action.component.scss']
})
export class MaterialDisplayActionComponent extends BaseDisplayItemComponent implements OnInit {
    @Input() public config: MaterialDisplayActionConfig;

    constructor() { super() }

    public ngOnInit(): void {
    }

}
