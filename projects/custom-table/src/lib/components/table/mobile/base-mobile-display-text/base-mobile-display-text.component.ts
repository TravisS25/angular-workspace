import { Component, OnInit } from '@angular/core';
import { BaseMobileDisplayItemComponent } from '../base-mobile-display-item/base-mobile-display-item.component';

@Component({
    selector: 'lib-base-mobile-display-text',
    templateUrl: './base-mobile-display-text.component.html',
    styleUrls: ['./base-mobile-display-text.component.scss']
})
export class BaseMobileDisplayTextComponent extends BaseMobileDisplayItemComponent implements OnInit {
    constructor() { super() }

    public ngOnInit(): void {

    }

}
