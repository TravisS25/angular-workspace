import { Component, OnInit, Input } from '@angular/core';
import { BaseColumnComponent } from '../../table/base-column/base-column.component';

@Component({
    selector: 'app-bool-body-cell',
    templateUrl: './bool-body-cell.component.html',
    styleUrls: ['./bool-body-cell.component.scss']
})
export class BoolBodyCellComponent extends BaseColumnComponent implements OnInit {
    constructor() {
        super();
    }

    ngOnInit(): void {

    }

}
