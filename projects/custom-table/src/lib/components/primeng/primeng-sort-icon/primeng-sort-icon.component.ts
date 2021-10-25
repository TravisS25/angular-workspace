import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'lib-primeng-sort-icon',
    templateUrl: './primeng-sort-icon.component.html',
    styleUrls: ['./primeng-sort-icon.component.scss']
})
export class PrimengSortIconComponent implements OnInit {
    @Input() public sortField: string
    @Input() public sortOrder: string;

    constructor() { }

    ngOnInit(): void {
    }

}
