import { Component, OnInit, Input } from '@angular/core';
import { BaseColumn } from '../../../table-api';

@Component({
    selector: 'app-bool-body-cell',
    templateUrl: './bool-body-cell.component.html',
    styleUrls: ['./bool-body-cell.component.scss']
})
export class BoolBodyCellComponent extends BaseColumn implements OnInit {
    constructor() {
        super();
    }

    ngOnInit(): void {

    }

}
