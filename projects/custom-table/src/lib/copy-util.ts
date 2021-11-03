import {
    Column,
    ColumnEntity,
    BaseModalConfig,
    APIConfig,
    State,
    CompositeFilterDescriptor,
    FilterDescriptor,
    GroupDescriptor,
    SortDescriptor,
    CoreColumn,
    PrimengColumn,
} from './table-api';
import _ from "lodash" // Import the entire lodash library
import { MenuItem } from 'primeng/api';
import { skip } from 'rxjs/operators';

export function deepCopyColumn(column: Column): Column {
    let c: Column = _.cloneDeep(column);
    c.sort = _.cloneDeep(column.sort);
    c.colStyle = _.cloneDeep(column.colStyle);
    c.headerStyle = _.cloneDeep(column.headerStyle);
    c.columnFilterStyle = _.cloneDeep(column.columnFilterStyle);
    c.bodyCellStyle = _.cloneDeep(column.bodyCellStyle);
    c.columnFilter = _.cloneDeepWith(column.columnFilter, function (val1) {
        if (val1 != undefined && val1 != null) {
            let cf = val1 as ColumnEntity;
            let newCF: ColumnEntity = _.cloneDeep(cf);
            //newCF.component = cf.component;
            newCF.config = _.cloneDeep(cf.config);
            newCF.selectedValue = cf.selectedValue;
            return newCF;
        }
    });
    c.bodyCell = _.cloneDeepWith(column.bodyCell, function (value) {
        if (value != undefined && value != null) {
            let bc = value as ColumnEntity;
            let newBC: ColumnEntity = _.cloneDeep(bc);
            newBC.component = _.cloneDeep(bc.component);
            newBC.config = _.cloneDeep(bc.config);
            newBC.processRowData = bc.processRowData;
            //newBC.onEvent = _.cloneDeep(bc.onEvent);
            return newBC;
        }

        return null;
    });
    c.bodyCellHTML = column.bodyCellHTML;

    return c
}

export function deepCopyCoreColumn(column: CoreColumn): CoreColumn {
    const c: Column = _.cloneDeep(column);
    c.sort = _.cloneDeep(column.sort);
    c.headerStyle = _.cloneDeep(column.headerStyle);
    c.columnFilterStyle = _.cloneDeep(column.columnFilterStyle);
    c.bodyCellStyle = _.cloneDeep(column.bodyCellStyle);
    c.bodyCellHTML = column.bodyCellHTML;
    c.columnFilter = _.cloneDeepWith(column.columnFilter, function (val1) {
        if (val1 != undefined && val1 != null) {
            const cf = val1 as ColumnEntity;
            const newCF: ColumnEntity = _.cloneDeep(cf);
            newCF.config = _.cloneDeep(cf.config);
            return newCF;
        }

        return null;
    });
    c.bodyCell = _.cloneDeepWith(column.bodyCell, function (val1) {
        if (val1 != undefined && val1 != null) {
            const cf = val1 as ColumnEntity;
            const newCF: ColumnEntity = _.cloneDeep(cf);
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

export function deepCopyBaseModalConfig(mc: BaseModalConfig): BaseModalConfig {
    let m: BaseModalConfig = {
        component: _.cloneDeep(mc.component),
        dialogConfig: _.cloneDeep(mc.dialogConfig),
        //processOnClose: mc.processOnClose,
    }

    return m;
}

export function deepCopyAPIConfig(c: APIConfig): APIConfig {
    let config: APIConfig = {
        apiURL: c.apiURL,
        processResult: c.processResult,
        apiOptions: _.cloneDeep(c.apiOptions),
        processError: c.processError,
    }
    return config;
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

// export function deepCopyState(item: State): State {
//     let state: State = item;
//     let filters: FilterDescriptor[] = [];
//     let groups: GroupDescriptor[] = [];
//     let sorts: SortDescriptor[] = [];

//     if(item.filter){
//         let vals = item.filter.filters as FilterDescriptor[];
//         vals.forEach(x => {
//             filters.push(x);
//         })
//     }

//     let filter: CompositeFilterDescriptor = {

//     }

//     state.filter


// }