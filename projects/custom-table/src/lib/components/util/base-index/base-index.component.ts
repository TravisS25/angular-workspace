import { ThrowStmt } from '@angular/compiler';
import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, Directive, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, Type, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { BaseTableConfig, BaseMobileTableConfig, State, BaseIndexTableEntity } from '../../../table-api';
import { Observable, Subject, Subscription } from 'rxjs';
import _ from "lodash" // Import the entire lodash library
import { WindowResizeService } from '../../../services/window-resize.service';
import { IndexTableI } from '../../../table-api';

// TableDirective is directive used to dynamically generate a table from <ng-template>
@Directive({
    selector: '[libTable]'
})
export class TableDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}

// MobileTableDirective is directive used to dynamically generate a mobile table from <ng-template>
@Directive({
    selector: '[libMobileTable]'
})
export class MobileTableDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}

// BaseIndexComponent is component that helps dynamically generate desktop or
// mobile table based on display size
@Component({
    selector: 'lib-base-index',
    templateUrl: './base-index.component.html',
    styleUrls: ['./base-index.component.scss']
})
export class BaseIndexComponent implements OnInit {
    // _sub is generic subscription
    private _sub: Subscription = new Subscription();

    // _currentState is state that will be set to table entity transitioning between
    // mobile and desktop views
    private _currentState: State;

    // _tableCR is reference to dynamically generated desktop table
    private _tableCR: ComponentRef<IndexTableI>;

    // _mobileTableCR is reference to dynamically generated mobile table
    private _mobileTableCR: ComponentRef<IndexTableI>;

    // _isPreviousMobile is a flag variable that is used to determine
    // if window was previously for mobile before current window resize
    //
    // This is used to compare with isMobileTable variable and if they 
    // are different, we know the user just resized screen from/to mobile view
    private _isPreviousMobile = false;

    // isMobileTable determines if currently diplaying mobile table
    public isMobileTable: boolean = false;

    // tableDir represents directive that will generate desktop table
    @ViewChildren(TableDirective) public tableDir: QueryList<TableDirective>;

    // mobileTableDir represents directive that will generate mobile table
    @ViewChildren(MobileTableDirective) public mobileTableDir: QueryList<MobileTableDirective>;

    // tableChangeWidth is width, in pixels, at which we determine when to 
    // transitiom from mobile to desktop or visa versa
    @Input() public tableChangeWidth: number = 991;

    // disableTableChange allows user to disable changing table views
    //
    // This can be useful in certain situations such as current user
    // does not want a mobile view even when on a phone
    @Input() public disableTableChange: boolean = false;

    // tableEntity is settings to dynamically generate table
    @Input() public tableEntity: BaseIndexTableEntity;

    // mobileTableEntity is settings to dynamically generate mobile table
    @Input() public mobileTableEntity: BaseIndexTableEntity;

    @Output() public windowChange: EventEmitter<void> = new EventEmitter();

    constructor(
        public cdr: ChangeDetectorRef,
        public cfr: ComponentFactoryResolver,
    ) { }

    private destroyAndCreateCr() {
        this.destroyCr();
        this.createCr();
        this.cdr.detectChanges();
    }

    // createCr looks at table flag and determines what table view to create
    private createCr() {
        if (this.isMobileTable) {
            console.log('creating mobile table!')
            this._mobileTableCR = this.mobileTableDir.toArray()[0].viewContainerRef.createComponent(
                this.cfr.resolveComponentFactory(this.mobileTableEntity.component),
            );

            this._mobileTableCR.instance.state = this._currentState
            this._mobileTableCR.instance.config = this.mobileTableEntity.config;
            this._mobileTableCR.onDestroy(() => { console.log('mobile destroyed') })
        } else {
            console.log('creating table!')
            this._tableCR = this.tableDir.toArray()[0].viewContainerRef.createComponent(
                this.cfr.resolveComponentFactory(this.tableEntity.component),
            );

            this._tableCR.instance.state = this._currentState;
            this._tableCR.instance.config = this.tableEntity.config;
            this._tableCR.onDestroy(() => { console.log('table destroyed') });
        }
    }


    // destroyCr looks at table flag and determines what table view to destroy
    private destroyCr() {
        if (this.isMobileTable && this._tableCR != undefined) {
            this._tableCR.destroy();
            this._tableCR = undefined;
        } else if (this._mobileTableCR != undefined) {
            this._mobileTableCR.destroy();
            this._mobileTableCR = undefined;
        }
    }

    // setCurrentState looks at table flag and sets _currentState based state
    // of that table view
    private setCurrentState() {
        if (this.isMobileTable) {
            this._currentState = this._mobileTableCR.instance.state;
        } else {
            this._currentState = this._tableCR.instance.state;
        }
    }

    // setTableFlag will set table flag which determines 
    private setTableFlag() {
        if (!this.disableTableChange) {
            if (window.innerWidth < this.tableChangeWidth) {
                this.isMobileTable = true;
            } else {
                this.isMobileTable = false;
            }
        }
    }

    // subscribeWindow uses global window object and listens for resizing of window
    // to change table views based on tableChangeWidth
    private subscribeWindow() {
        window.onresize = () => {
            this.windowChange.emit()
            this.setCurrentState();
            this.setTableFlag();

            if (this._isPreviousMobile != this.isMobileTable) {
                this.destroyAndCreateCr()
            }

            this._isPreviousMobile = this.isMobileTable;
        }
    }

    public ngOnInit(): void {
        if (this.tableEntity == undefined || this.mobileTableEntity == undefined) {
            throw ('MUST SET BOTH "tableEntity" AND "mobileTableEntity" INPUTS!')
        }

        this.subscribeWindow();
        this.setTableFlag();
        this._isPreviousMobile = this.isMobileTable;
    }

    public ngAfterViewInit() {
        this.createCr()
        this.cdr.detectChanges();
    }

    public ngOnDestroy() {
        this._sub.unsubscribe();
    }
}
