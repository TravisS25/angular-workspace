import { Component, Input, OnInit } from '@angular/core';
import { BaseMobileDisplayItemComponent } from '../../../../table/mobile/base-mobile-display-item/base-mobile-display-item.component';

@Component({
    selector: 'lib-mobile-display-text',
    templateUrl: './mobile-display-text.component.html',
    styleUrls: ['./mobile-display-text.component.scss']
})
export class MobileDisplayTextComponent extends BaseMobileDisplayItemComponent implements OnInit {
    constructor() { super() }

    ngOnInit(): void {
    }

}
