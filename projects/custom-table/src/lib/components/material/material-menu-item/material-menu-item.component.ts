import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenu, MenuPositionX, MenuPositionY } from '@angular/material/menu';
import { BaseTableEvent, ActionEvents } from '../../../table-api';

export interface MaterialMenuItem {
    label: string;
    field?: string;
    value?: any;
    iconClass?: string;
    iconLabel?: string;
    rowIdx?: number;
    rowData?: any;
    xPosition?: MenuPositionX
    yPosition?: MenuPositionY;
    overlapTrigger?: boolean;
    childMenu?: MaterialMenuItem[];
}

@Component({
    selector: 'lib-material-menu-item',
    templateUrl: './material-menu-item.component.html',
    styleUrls: ['./material-menu-item.component.scss']
})
export class MaterialMenuItemComponent implements OnInit {
    @Input() public rowData: any;
    @Input() public rowIdx: number;
    @Input() public field: string;
    @Input() public xPosition: MenuPositionX = 'after';
    @Input() public yPosition: MenuPositionY = 'below';
    @Input() public overlapTrigger: boolean = false;
    @Input() public items: MaterialMenuItem[];
    @Output() public onEvent: EventEmitter<any> = new EventEmitter();
    @ViewChild(MatMenu, { static: true }) public childMenu: MatMenu;

    constructor() { }

    private initValues() {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].xPosition == undefined) {
                this.items[i].xPosition = 'after';
            }
            if (this.items[i].yPosition == undefined) {
                this.items[i].yPosition = 'below';
            }
            if (this.items[i].overlapTrigger == undefined) {
                this.items[i].overlapTrigger = false;
            }
        }
    }

    private getBaseEvent(event: MaterialMenuItem, fieldName: any): BaseTableEvent {
        event.rowData = this.rowData;
        event.rowIdx = this.rowIdx;

        return {
            eventFieldName: fieldName,
            event: event,
        }
    }

    public ngOnInit(): void {
        this.initValues();
    }

    public onClickEvent(event: MaterialMenuItem) {
        console.log('click event activated');
        console.log(event)
        this.onEvent.emit(this.getBaseEvent(event, this.field))
    }

    public onMouseLeaveEvent(event: MaterialMenuItem) {
        console.log('mouse leave event activated');
        this.onEvent.emit(this.getBaseEvent(event, ActionEvents.mouseLeave))
    }

    public onMouseEnterEvent(event: MaterialMenuItem) {
        console.log('mouse enter event activated');
        this.onEvent.emit(this.getBaseEvent(event, ActionEvents.mouseLeave))
    }

    public submenuEvent(event: BaseTableEvent) {
        this.onEvent.emit(event)
    }
}
