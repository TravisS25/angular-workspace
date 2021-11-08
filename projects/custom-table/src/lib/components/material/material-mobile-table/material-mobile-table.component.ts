import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, Directive, EventEmitter, Input, OnDestroy, OnInit, QueryList, Type, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { getDefaultState } from '../../../default-values';
import { BehaviorSubject, combineLatest, forkJoin, Observable, Subject, Subscription } from 'rxjs';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { MatMenuPanel } from '@angular/material/menu';
import _ from "lodash" // Import the entire lodash library
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { encodeURIState } from '../../../util';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/combineLatest';
import { take } from 'rxjs/operators';
import { BaseMobileTableComponent } from '../../table/mobile/base-mobile-table/base-mobile-table.component';
import { MatTable } from '@angular/material/table';
import { HttpService } from '../../../services/http.service';
import { animate, state, style, transition, trigger } from '@angular/animations';


@Component({
    selector: 'lib-material-mobile-table',
    templateUrl: './material-mobile-table.component.html',
    styleUrls: ['./material-mobile-table.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class MaterialMobileTableComponent extends BaseMobileTableComponent implements OnInit {
    @ViewChild(MatTable) public table: MatTable<any>;
    public expandedRows: Map<number, boolean> = new Map();

    constructor(
        public http: HttpService,
        public cfr: ComponentFactoryResolver,
        public cdr: ChangeDetectorRef,
    ) {
        super(http, cfr, cdr);
    }

    public ngOnInit(): void {
        super.ngOnInit();
    }

    public onPageChange(event: PageEvent) {
        this.state.take = event.pageSize;
        this.state.skip = event.pageIndex * event.pageSize;
        this.refresh();
    }
}
