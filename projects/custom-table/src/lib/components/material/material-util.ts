import { ComponentFactoryResolver, ComponentRef, EventEmitter, QueryList } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Sort } from "@angular/material/sort";
import { BaseTableEvent, SortDescriptor, State, TableEvents, BaseComponentEntity } from "../../table-api";
import { BaseComponent } from '../base/base.component'
import { TableRowExpansionDirective } from "../../directives/table/table-row-expansion.directive";

// onMaterialSortChange is util function that performs default actions when user
// clicks on column to sort
export function onMaterialSortChange(
    sort: Sort,
    sortEvent: EventEmitter<BaseTableEvent>,
    autoSearch: boolean,
    state: State,
    update: () => void,
) {
    state.sort = []

    if (sort.direction != '') {
        const s: SortDescriptor = {
            field: sort.active
        }

        switch (sort.direction) {
            case 'asc':
                s.dir = 'asc';
            case 'desc':
                s.dir = 'desc'
        }

        state.sort.push({
            field: sort.active,
            dir: sort.direction
        })
    }

    sortEvent.emit({
        eventFieldName: sort.active,
    });

    if (autoSearch) {
        update();
    }
}

// onMaterialPageChange is util function that performs default pagination
// actions when user selects new list of items
export function onMaterialPageChange(event: PageEvent, state: State, update: () => void) {
    state.skip = event.pageSize * event.pageIndex;
    state.take = event.pageSize;
    update();
}

// onMaterialRowExpandAnimation is util function that will expand and collapse material row
export function onMaterialRowExpandAnimation(
    event: AnimationEvent,
    rowIdx: number,
    rowExpansionDirs: QueryList<TableRowExpansionDirective>,
    rowExpansionCrs: ComponentRef<BaseComponent>[],
    rowExpansionEntity: BaseComponentEntity,
    cfr: ComponentFactoryResolver,
    componentRef: any,
) {
    if (event.animationName == 'expanded') {
        const dir = rowExpansionDirs.toArray()[rowIdx];
        const cr = dir.viewContainerRef.createComponent(
            cfr.resolveComponentFactory(rowExpansionEntity.component)
        );

        cr.instance.outerData = dir.rowData;
        cr.instance.config = rowExpansionEntity.config;
        cr.instance.componentRef = componentRef;
        rowExpansionCrs.push(cr);
    } else {
        rowExpansionCrs[rowIdx].destroy();
        rowExpansionCrs.splice(rowIdx, 1);
    }
}

export function materialRowExpand(rowIdx: number, expandRows: boolean[]) {
    if (rowIdx > -1 && rowIdx < expandRows.length) {
        expandRows[rowIdx] = true;
    }
}

export function materialRowCollapse(rowIdx: number, expandRows: boolean[]) {
    if (rowIdx > -1 && rowIdx < expandRows.length) {
        expandRows[rowIdx] = false;
    }
}
