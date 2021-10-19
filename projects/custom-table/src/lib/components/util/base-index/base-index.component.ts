import { ThrowStmt } from '@angular/compiler';
import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, Directive, Input, OnDestroy, OnInit, QueryList, Type, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { BaseTableConfig, MobileTableConfig, State, BaseTable } from '../../../table-api';
import { Observable, Subject, Subscription } from 'rxjs';
import _ from "lodash" // Import the entire lodash library
import { WindowResizeService } from '../../../services/window-resize.service';
import { BaseIndexTableEntity, TableStateI } from 'projects/custom-table/src/public-api';


@Directive({
    selector: '[libTable]'
})
export class TableDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}

@Directive({
    selector: '[libMobileTable]'
})
export class MobileTableDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}

@Component({
    selector: 'lib-base-index',
    templateUrl: './base-index.component.html',
    styleUrls: ['./base-index.component.scss']
})
export class BaseIndexComponent implements OnInit {
    private _isMobilePrevious: boolean = null;
    private _windowSub: Subscription;
    private _currentState: State;

    private _tableCR: ComponentRef<TableStateI>;
    private _mobileTableCR: ComponentRef<TableStateI>;

    protected processWindowResize: (width: number, table: any) => void;

    public isMobileTable: boolean = false;

    @ViewChildren(TableDirective) public tableDir: QueryList<TableDirective>;
    @ViewChildren(MobileTableDirective) public mobileTableDir: QueryList<MobileTableDirective>;

    @Input() public tableChangeWidth: number = 991;
    @Input() public disableTableChange: boolean = false;
    @Input() public tableEntity: BaseIndexTableEntity;
    @Input() public mobileTableEntity: BaseIndexTableEntity;

    constructor(
        public cdr: ChangeDetectorRef,
        public cfr: ComponentFactoryResolver,
        public windowResizeService: WindowResizeService,
    ) { }

    private setCurrentState() {
        if (this.isMobileTable) {
            if (this.mobileTableDir && !this._mobileTableCR) {
                const arr = this.mobileTableDir.toArray();

                if (arr.length > 0) {
                    this._mobileTableCR = arr[0].viewContainerRef.createComponent(
                        this.cfr.resolveComponentFactory(
                            this.mobileTableEntity.component
                        ),
                    );
                }

                this._currentState = this._mobileTableCR.instance.state;
            }
        } else {
            if (this.tableDir && !this._tableCR) {
                const arr = this.tableDir.toArray();

                if (arr.length > 0) {
                    this._tableCR = arr[0].viewContainerRef.createComponent(
                        this.cfr.resolveComponentFactory(
                            this.tableEntity.component
                        ),
                    );
                }

                this._currentState = this._tableCR.instance.state;
            }
        }
    }

    private setTableSettings(width: number, windowResizing: boolean) {
        this.setCurrentState();

        // If window size is smaller than bootstrap lg settings, then 
        // we are in mobile view 
        //
        // Else we are considered on large screen / desktop
        if (width < this.tableChangeWidth) {
            // If window is resizing and previous was setting was not, then we
            // are going from large / desktop screen to mobile screen
            // This will usually occur with tablets where vertial is mobile
            // but horizontal is desktop
            if (windowResizing && this._isMobilePrevious !== null && this._isMobilePrevious === false) {
                console.log('_current state')
                console.log(this._currentState)

                this.mobileTableEntity.config.getTableChangeState = (outerData: any): State => {
                    return this._currentState;
                }
            }

            if (!this.disableTableChange) {
                this.isMobileTable = true;
            }
        } else {
            if (windowResizing && this._isMobilePrevious !== null && this._isMobilePrevious === true) {
                console.log('_current state')
                console.log(this._currentState)

                this.tableEntity.config.getTableChangeState = (outerData: any): State => {
                    return this._currentState;
                }
            }

            if (!this.disableTableChange) {
                this.isMobileTable = false;
            }
        }
    }

    private unsubscribeWindow() {
        if (this._windowSub && !this._windowSub.closed) {
            this._windowSub.unsubscribe();
        }
    }

    private subscribeWindow() {
        this._windowSub = this.windowResizeService.getWindowSizeObs().subscribe(r => {
            this.setTableSettings(r, true);
            this._isMobilePrevious = this.isMobileTable;

            if (this.processWindowResize != undefined) {
                this.processWindowResize(r, this);
            }
        })
    }

    public ngOnInit(): void {
        if (this.tableEntity == undefined || this.mobileTableEntity == undefined) {
            throw ('MUST SET BOTH "tableEntity" AND "mobileTableEntity" INPUTS!')
        }

        this.setTableSettings(this.windowResizeService.getwindowSize(), false);
        this.subscribeWindow();
    }

    public ngAfterViewInit() {
        this.setCurrentState();
    }

    public ngOnDestroy() {
        this.unsubscribeWindow();
        this._windowSub = null;
    }

}
