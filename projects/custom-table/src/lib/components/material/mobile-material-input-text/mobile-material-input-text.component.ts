import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MaterialInputTextComponent } from '../material-input-text/material-input-text.component';

@Component({
    selector: 'lib-mobile-material-input-text',
    templateUrl: './mobile-material-input-text.component.html',
    styleUrls: ['./mobile-material-input-text.component.scss']
})
export class MobileMaterialInputTextComponent extends MaterialInputTextComponent implements OnInit {

    constructor(public cdr: ChangeDetectorRef) { super(cdr) }

    public ngOnInit(): void {
        super.ngOnInit();
    }

}
