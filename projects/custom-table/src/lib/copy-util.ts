import {
    ColumnFilterEntity,
    APIConfig,
    State,
    CompositeFilterDescriptor,
    FilterDescriptor,
    GroupDescriptor,
    SortDescriptor,
    CoreColumn,
    AggregateDescriptor,
} from './table-api';
import _ from "lodash" // Import the entire lodash library
import { MenuItem } from 'primeng/api';
import { skip } from 'rxjs/operators';
import { PrimengColumn } from './components/primeng/primeng-table/primeng-table.component';

export function deepCopyCoreColumn(column: CoreColumn): CoreColumn {
    const c: CoreColumn = _.cloneDeep(column);
    c.sort = _.cloneDeep(column.sort);
    c.headerStyle = _.cloneDeep(column.headerStyle);
    c.columnFilterStyle = _.cloneDeep(column.columnFilterStyle);
    //c.tableCellStyle = _.cloneDeep(column.tableCellStyle);
    //c.tableCellHTML = column.tableCellHTML;
    c.columnFilter = _.cloneDeepWith(column.columnFilter, function (val1) {
        if (val1 != undefined && val1 != null) {
            const cf = val1 as ColumnFilterEntity;
            const newCF: ColumnFilterEntity = _.cloneDeep(cf);
            newCF.config = _.cloneDeep(cf.config);
            return newCF;
        }

        return null;
    });
    c.tableCell = _.cloneDeepWith(column.tableCell, function (val1) {
        if (val1 != undefined && val1 != null) {
            const cf = val1 as ColumnFilterEntity;
            const newCF: ColumnFilterEntity = _.cloneDeep(cf);
            newCF.config = _.cloneDeep(cf.config);
            return newCF;
        }

        return null;
    });

    return c
}

export function deepCopyPrimengColumn(column: PrimengColumn): PrimengColumn {
    const coreCol = deepCopyCoreColumn(column)
    const col: PrimengColumn = coreCol;
    col.renderColumnContent = column.renderColumnContent
    col.templateConfig = _.cloneDeep(column.templateConfig);
    col.colStyle = _.cloneDeep(column.colStyle);
    return col;
}

export function deepCopyAPIConfig(c: APIConfig): APIConfig {
    return {
        apiURL: c.apiURL,
        apiOptions: _.cloneDeep(c.apiOptions),
    }
}

export function deepCopyMenuItem(item: MenuItem): MenuItem {
    let copyBaseItemFn = function (baseItem: MenuItem): MenuItem {
        let copyItem: MenuItem = _.cloneDeep(baseItem);
        copyItem.routerLinkActiveOptions = _.cloneDeep(baseItem.routerLinkActiveOptions);
        copyItem.style = _.cloneDeep(baseItem.style);
        copyItem.state = _.cloneDeep(baseItem.state);
        copyItem.automationId = _.cloneDeep(baseItem.automationId);
        copyItem.routerLink = _.cloneDeep(baseItem.routerLink);
        copyItem.queryParams = _.cloneDeep(baseItem.queryParams);
        copyItem.queryParamsHandling = _.cloneDeep(baseItem.queryParamsHandling);
        copyItem.command = baseItem.command;
        return copyItem;
    }

    let copyItem = copyBaseItemFn(item);
    copyItem.items = _.cloneDeepWith(item.items, function (val) {
        if (val != undefined && val != null) {
            let itemFn = function (itemParam: MenuItem): MenuItem {
                let innerItem: MenuItem = copyBaseItemFn(itemParam);

                if (
                    innerItem.items != undefined &&
                    innerItem.items != null &&
                    innerItem.items.length != 0
                ) {
                    for (let i = 0; i < innerItem.items.length; i++) {
                        console.log(innerItem.items[i])
                        innerItem.items[i] = itemFn(innerItem.items[i]);
                    }

                    return innerItem;
                } else {
                    return innerItem;
                }
            }

            let itemVals = val as MenuItem[];
            let newRowOptions: MenuItem[] = [];

            for (let i = 0; i < itemVals.length; i++) {
                newRowOptions.push(itemFn(itemVals[i]))
            }

            return newRowOptions;
        }

        return null;
    })

    return copyItem;
}

export function deepCopyState(item: State): State {
    const state: State = {
        take: item.take,
        skip: item.skip,
    };

    const sorts: SortDescriptor[] = [];

    if (item.filter != undefined) {
        const filters: FilterDescriptor[] = [];

        item.filter.filters.forEach(x => {
            filters.push({
                field: x.field,
                operator: x.operator,
                value: x.value,
                ignoreCase: x.ignoreCase,
            });
        })
        state.filter = {
            logic: 'and',
            filters: filters
        }
    }

    if (item.group != undefined) {
        const groups: GroupDescriptor[] = [];

        item.group.forEach(x => {
            const aggDes: AggregateDescriptor[] = [];

            if (x.aggregates != undefined) {
                x.aggregates.forEach(t => {
                    aggDes.push({
                        field: t.field,
                        aggregate: t.aggregate
                    })
                })
            }

            groups.push({
                field: x.field,
                dir: x.dir,
                aggregates: aggDes
            })
        })

        state.group = groups;
    }

    if (item.sort != undefined) {
        const sorts: SortDescriptor[] = [];

        item.sort.forEach(x => {
            sorts.push({
                field: x.field,
                dir: x.dir,
            })
        })

        state.sort = sorts;
    }

    return state;
}