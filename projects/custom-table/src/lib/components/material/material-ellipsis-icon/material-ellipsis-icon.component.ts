import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
    selector: 'lib-material-ellipsis-icon',
    templateUrl: './material-ellipsis-icon.component.html',
    styleUrls: ['./material-ellipsis-icon.component.scss']
})
export class MaterialEllipsisIconComponent implements OnInit {
    @Output() public onClick: EventEmitter<void> = new EventEmitter();

    constructor() { }

    public ngOnInit(): void {
    }

    public clickEvent(event: any) {
        if (this.onClick != undefined) {
            this.onClick.emit(event);
        }
    }
}
