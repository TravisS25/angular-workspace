import { Component, OnInit, Input } from '@angular/core';
import { BaseColumnItems } from '../../../table-api';

@Component({
    selector: 'app-bool-body-cell',
    templateUrl: './bool-body-cell.component.html',
    styleUrls: ['./bool-body-cell.component.scss']
})
export class BoolBodyCellComponent extends BaseColumnItems implements OnInit {
    constructor() {
        super();
    }

    ngOnInit(): void {

    }

}
