import { ThrowStmt } from '@angular/compiler';
import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, Directive, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, Type, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { TableConfig, MobileTableConfig, State, BaseIndexTableEntity, TableSwitchI } from '../../../table-api';
import { Observable, Subject, Subscription } from 'rxjs';
import _ from "lodash" // Import the entire lodash library
import { WindowResizeService } from '../../../services/window-resize.service';


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
    private _sub: Subscription = new Subscription();
    private _currentState: State;
    private _isViewInit = false;

    private _tableCR: ComponentRef<TableSwitchI>;
    private _mobileTableCR: ComponentRef<TableSwitchI>;

    public isMobileTable: boolean = false;

    @ViewChildren(TableDirective) public tableDir: QueryList<TableDirective>;
    @ViewChildren(MobileTableDirective) public mobileTableDir: QueryList<MobileTableDirective>;

    @Input() public tableChangeWidth: number = 991;
    @Input() public disableTableChange: boolean = false;
    @Input() public tableEntity: BaseIndexTableEntity;
    @Input() public mobileTableEntity: BaseIndexTableEntity;
    @Output() public windowChange: EventEmitter<number> = new EventEmitter();

    constructor(
        public cdr: ChangeDetectorRef,
        public cfr: ComponentFactoryResolver,
        public windowResizeService: WindowResizeService,
    ) { }

    private subscribeDirChanges() {
        this._sub.add(
            this.tableDir.changes.subscribe(r => {
                console.log('table dir changes')
                console.log(r)

                if (r.length > 0) {
                    this.tableEntity.config.getTableStateChange = (outerData: any): State => {
                        return this._currentState;
                    }

                    this.destroyCr()
                    this.createCr();
                    this.cdr.detectChanges();
                }
            })
        )
        this._sub.add(
            this.mobileTableDir.changes.subscribe(r => {
                console.log('mobile table dir changes')
                console.log(r)

                this.mobileTableEntity.config.getTableStateChange = (outerData: any): State => {
                    return this._currentState;
                }

                if (r.length > 0) {
                    this.destroyCr()
                    this.createCr();
                    this.cdr.detectChanges();
                }
            })
        )
    }

    private createCr() {
        if (this.isMobileTable) {
            console.log('creating mobile table!')
            this._mobileTableCR = this.mobileTableDir.toArray()[0].viewContainerRef.createComponent(
                this.cfr.resolveComponentFactory(
                    this.mobileTableEntity.component
                ),
            );

            this._mobileTableCR.instance.config = this.mobileTableEntity.config;
            this._mobileTableCR.onDestroy(() => { console.log('mobile destroyed') })
        } else {
            console.log('creating table!')
            this._tableCR = this.tableDir.toArray()[0].viewContainerRef.createComponent(
                this.cfr.resolveComponentFactory(
                    this.tableEntity.component
                ),
            );

            this._tableCR.instance.config = this.tableEntity.config;
            this._tableCR.onDestroy(() => { console.log('table destroyed') });
        }
    }

    private destroyCr() {
        if (this.isMobileTable) {
            if (this._tableCR != undefined) {
                this._tableCR.destroy();
                this._tableCR = undefined;
            }
        } else {
            if (this._mobileTableCR != undefined) {
                this._mobileTableCR.destroy();
                this._mobileTableCR = undefined;
            }
        }
    }

    // private destroyCr(destroyMobile: boolean) {
    //     if (destroyMobile) {
    //         if (this._mobileTableCR != undefined) {
    //             this._mobileTableCR.destroy();
    //             this._mobileTableCR = undefined;
    //         }
    //     } else {
    //         if (this._tableCR != undefined) {
    //             this._tableCR.destroy();
    //             this._tableCR = undefined;
    //         }
    //     }
    // }

    private setCurrentState() {
        if (this.isMobileTable) {
            this._currentState = this._mobileTableCR.instance.state;
        } else {
            this._currentState = this._tableCR.instance.state;
        }
    }

    private setTableSettings(width: number) {
        if (!this.disableTableChange) {
            if (width < this.tableChangeWidth) {
                this.isMobileTable = true;
            } else {
                this.isMobileTable = false;
            }
        }
    }

    private unsubscribeSub() {
        if (this._sub && !this._sub.closed) {
            this._sub.unsubscribe();
        }
        this._sub = null;
    }

    private subscribeWindow() {
        window.onresize = () => {
            this.windowResizeService.setWindowSize(window.innerWidth);
        }
        this._sub.add(
            this.windowResizeService.getWindowSizeObs().subscribe(r => {
                this.setCurrentState();
                this.setTableSettings(r);
                this._isMobilePrevious = this.isMobileTable;
                this.windowChange.emit(r);
            })
        )
    }

    public ngOnInit(): void {
        if (this.tableEntity == undefined || this.mobileTableEntity == undefined) {
            throw ('MUST SET BOTH "tableEntity" AND "mobileTableEntity" INPUTS!')
        }

        this.subscribeWindow();
        this.setTableSettings(window.innerWidth);
    }

    public ngAfterViewInit() {
        this._isViewInit = true;
        this.createCr()
        this.subscribeDirChanges();
        this.cdr.detectChanges();
    }

    public ngOnDestroy() {
        this.unsubscribeSub();
    }

}
