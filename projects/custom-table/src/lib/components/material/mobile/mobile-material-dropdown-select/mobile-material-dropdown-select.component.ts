import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MaterialDropdownSelectComponent } from '../../material-dropdown-select/material-dropdown-select.component';

@Component({
    selector: 'lib-mobile-material-dropdown-select',
    templateUrl: './mobile-material-dropdown-select.component.html',
    styleUrls: ['./mobile-material-dropdown-select.component.scss']
})
export class MobileMaterialDropdownSelectComponent extends MaterialDropdownSelectComponent implements OnInit {

    constructor(public cdr: ChangeDetectorRef) { super(cdr) }

    public ngOnInit(): void {
        super.ngOnInit();
    }

    public event(event: any) {
        this.onEvent.emit(event);
    }
}
