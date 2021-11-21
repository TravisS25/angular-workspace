import { ComponentFactoryResolver, ComponentRef, EventEmitter, QueryList } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Sort } from "@angular/material/sort";
import { BaseTableEvent, SortDescriptor, State, TableEvents, BaseComponentEntity } from "../../table-api";
import { BaseComponent } from '../base/base.component'
import { TableRowExpansionDirective } from "../../directives/table/table-row-expansion.directive";

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

export function onMaterialPageChange(event: PageEvent, state: State, update: () => void) {
    state.skip = event.pageSize * event.pageIndex;
    state.take = event.pageSize;
    update();
}

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