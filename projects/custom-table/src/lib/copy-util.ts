import {
    Column,
    BodyCell,
    ColumnFilter,
    BaseModalConfig,
    APIConfig,
} from './table-api';
import _ from "lodash" // Import the entire lodash library
import { DeleteTableModal, DynamicDetailsTableModalConfig, DynamicDeleteTableModalConfig } from './components/body-cell-components/table-modal/table-modal.component';
import { RowOptionsComponent, RowOptionsConfig } from './components/body-cell-components/row-options/row-options.component';
import { RowOptionsModule } from './modules/row-options.module';
import { MenuItem } from 'primeng/api';

// export function deepCopyColumn(column: Column): Column{
// 	let c: Column = {
// 		field: column.field,
// 		header: column.header,
// 		hideColumn: column.hideColumn,
// 		hideColumnCheckbox: column.hideColumnCheckbox,
// 		hideColumnFilter: column.hideColumnFilter,
// 		renderColumnContent: column.renderColumnContent,
// 		headerFilterClass: column.headerFilterClass,
// 		bodyCellClass: column.bodyCellClass,
// 		headerClass: column.headerClass,
// 		sort: _.cloneDeep(column.sort),
// 		colStyle: _.cloneDeep(column.colStyle),
// 		headerStyle: _.cloneDeep(column.headerStyle),
// 		headerFilterStyle: _.cloneDeep(column.headerFilterStyle),
// 		bodyCellStyle: _.cloneDeep(column.bodyCellStyle),
// 		columnFilter: _.cloneDeepWith(column.columnFilter, function(val1){
// 			if(val1 != undefined && val1 != null){
// 				let cf = val1 as ColumnFilter;
// 				let newCF: ColumnFilter = {
// 					component: _.cloneDeep(cf.component),
// 					field: cf.field,
// 					config: _.cloneDeep(cf.config),
// 					getValue: cf.getValue,
// 					value: _.cloneDeep(cf.value),
// 					subComponents: _.cloneDeepWith(cf.subComponents, function(val2){
// 						if(val2 != undefined && val2 != null){
// 							let scFn = function(sc: SubComponentConfig): SubComponentConfig{
// 								let newSC: SubComponentConfig = {
// 									component: _.cloneDeep(sc.component),
// 									config: _.cloneDeep(sc.config),
// 									subComponents: _.cloneDeep(sc.subComponents)
// 								}

// 								if(
// 									newSC.subComponents != undefined && 
// 									newSC.subComponents != null && 
// 									newSC.subComponents.length != 0
// 								){
// 									for(let i = 0; i < newSC.subComponents.length; i++){
// 										console.log(newSC.subComponents[i])
// 										newSC.subComponents[i] = scFn(newSC.subComponents[i]);
// 									}

// 									return newSC
// 								} else{
// 									return newSC;
// 								}
// 							}

// 							let scs = val2 as SubComponentConfig[]
// 							let newSCs: SubComponentConfig[] = [];

// 							for(let i = 0; i < scs.length; i++){
// 								newSCs.push(scFn(scs[i]))
// 							}

// 							return newSCs;
// 						}

// 						return null;
// 					}),
// 				}

// 				return newCF;
// 			}
// 		}),
// 		bodyCell: _.cloneDeepWith(column.bodyCell, function(value){
// 			if(value != undefined && value != null){
// 				let bc = value as BodyCell;
// 				let newBC: BodyCell = {
// 					component: _.cloneDeep(bc.component),
// 					config: _.cloneDeep(bc.config),
// 					processRowData: bc.processRowData,
// 					//onColumnFilterEvent: _.cloneDeep(bc.onColumnFilterEvent),
// 					onChange: _.cloneDeep(bc.onChange),

// 					// We don't want to make deep copy of base table here
// 					// as we WANT a reference to base table
// 					baseTable: bc.baseTable,
// 				}
// 				return newBC;
// 			}

// 			return null;
// 		}),
// 		bodyCellHTML: column.bodyCellHTML,
// 	}
// 	return c
// }

export function deepCopyColumn(column: Column): Column {
    let c: Column = _.cloneDeep(column);
    c.sort = _.cloneDeep(column.sort);
    c.colStyle = _.cloneDeep(column.colStyle);
    c.headerStyle = _.cloneDeep(column.headerStyle);
    c.headerFilterStyle = _.cloneDeep(column.headerFilterStyle);
    c.bodyCellStyle = _.cloneDeep(column.bodyCellStyle);
    c.columnFilter = _.cloneDeepWith(column.columnFilter, function (val1) {
        if (val1 != undefined && val1 != null) {
            let cf = val1 as ColumnFilter;
            let newCF: ColumnFilter = _.cloneDeep(cf);
            newCF.component = _.cloneDeep(cf.component);
            newCF.config = _.cloneDeep(cf.config);
            newCF.selectedValue = cf.selectedValue;
            // newCF.subComponents = _.cloneDeepWith(cf.subComponents, function(val2){
            // 	if(val2 != undefined && val2 != null){
            // 		let scFn = function(sc: SubComponentConfig): SubComponentConfig{
            // 			let newSC: SubComponentConfig = {
            // 				component: _.cloneDeep(sc.component),
            // 				config: _.cloneDeep(sc.config),
            // 				subComponents: _.cloneDeep(sc.subComponents)
            // 			}

            // 			if(
            // 				newSC.subComponents != undefined && 
            // 				newSC.subComponents != null && 
            // 				newSC.subComponents.length != 0
            // 			){
            // 				for(let i = 0; i < newSC.subComponents.length; i++){
            // 					console.log(newSC.subComponents[i])
            // 					newSC.subComponents[i] = scFn(newSC.subComponents[i]);
            // 				}

            // 				return newSC
            // 			} else{
            // 				return newSC;
            // 			}
            // 		}

            // 		let scs = val2 as SubComponentConfig[]
            // 		let newSCs: SubComponentConfig[] = [];

            // 		for(let i = 0; i < scs.length; i++){
            // 			newSCs.push(scFn(scs[i]))
            // 		}

            // 		return newSCs;
            // 	}

            // 	return null;
            // });

            return newCF;
        }
    });
    c.bodyCell = _.cloneDeepWith(column.bodyCell, function (value) {
        if (value != undefined && value != null) {
            let bc = value as BodyCell;
            let newBC: BodyCell = _.cloneDeep(bc);
            newBC.component = _.cloneDeep(bc.component);
            newBC.config = _.cloneDeep(bc.config);
            newBC.processRowData = bc.processRowData;
            newBC.onBodyCellEvent = _.cloneDeep(bc.onBodyCellEvent);
            return newBC;
        }

        return null;
    });
    c.bodyCellHTML = column.bodyCellHTML;

    return c
}

export function deepCopyBaseModalConfig(mc: BaseModalConfig): BaseModalConfig {
    let m: BaseModalConfig = {
        component: _.cloneDeep(mc.component),
        dialogConfig: _.cloneDeep(mc.dialogConfig),
        //processOnClose: mc.processOnClose,
    }

    return m;
}

export function deepCopyDynamicDeleteTableModalConfig(dtmc: DynamicDeleteTableModalConfig): DynamicDeleteTableModalConfig {
    let modalConfigCopy = deepCopyBaseModalConfig(dtmc.modalConfig);
    let d: DynamicDeleteTableModalConfig = {
        modalConfig: modalConfigCopy,
        tableModalConfig: _.cloneDeep(dtmc.tableModalConfig),
    }

    return d;
}

export function deepCopyDynamicDetailsModalConfig(dtmc: DynamicDetailsTableModalConfig): DynamicDetailsTableModalConfig {
    let modalConfigCopy = deepCopyBaseModalConfig(dtmc.modalConfig);
    let d: DynamicDetailsTableModalConfig = {
        modalConfig: modalConfigCopy,
        tableModalConfig: _.cloneDeep(dtmc.tableModalConfig),
    }

    return d;
}

// export function deepCopyEditModalConfig(dmc: EditModalConfig): EditModalConfig{
// 	let mc = deepCopyBaseModalConfig(dmc);
// 	let d: EditModalConfig = {
// 		component: _.cloneDeep(mc.component),
// 		modalConfig: _.cloneDeep(mc.modalConfig),
// 		modalData: _.cloneDeep(dmc.modalData, function(val1){
// 			let md: EditTableModal = val1;
// 			let nmd: EditTableModal = {
// 				type: 'edit',
// 				rowData: md.rowData,
// 				successCloseResult: md.successCloseResult,
// 				//actionAPI: deepCopyAPIConfig(md.actionAPI),
// 			}
// 			return nmd;
// 		})
// 	}

// 	return d;
// }

export function deepCopyAPIConfig(c: APIConfig): APIConfig {
    let config: APIConfig = {
        apiURL: c.apiURL,
        processResult: c.processResult,
        apiOptions: _.cloneDeep(c.apiOptions),
        processError: c.processError,
    }
    return config;
}

// export function deepCopyRowOptionItem(item: RowOptionItem): RowOptionItem{
// 	let copyBaseItemFn = function(baseItem: RowOptionItem): RowOptionItem{
// 		let copyItem: RowOptionItem = _.cloneDeep(baseItem);
// 		copyItem.routerLinkActiveOptions = _.cloneDeep(baseItem.routerLinkActiveOptions);
// 		copyItem.style = _.cloneDeep(baseItem.style);
// 		copyItem.state = _.cloneDeep(baseItem.state);
// 		copyItem.automationId = _.cloneDeep(baseItem.automationId);
// 		copyItem.routerLink = _.cloneDeep(baseItem.routerLink);
// 		copyItem.queryParams = _.cloneDeep(baseItem.queryParams);
// 		copyItem.queryParamsHandling = _.cloneDeep(baseItem.queryParamsHandling);
// 		copyItem.processClick = baseItem.processClick;
// 		copyItem.command = baseItem.command;
// 		return copyItem;
// 	}

// 	let copyItem = copyBaseItemFn(item);
// 	copyItem.items = _.cloneDeepWith(item.items, function(val){
// 		if(val != undefined && val != null){
// 			let itemFn = function(itemParam: RowOptionItem): RowOptionItem{
// 				let innerItem: RowOptionItem = copyBaseItemFn(itemParam);

// 				if(
// 					innerItem.items != undefined &&
// 					innerItem.items != null &&
// 					innerItem.items.length != 0
// 				){
// 					for(let i = 0; i < innerItem.items.length; i++){
// 						console.log(innerItem.items[i])
// 						innerItem.items[i] = itemFn(innerItem.items[i]);
// 					}

// 					return innerItem;
// 				} else{
// 					return innerItem;
// 				}
// 			}

// 			let itemVals = val as RowOptionItem[];
// 			let newRowOptions: RowOptionItem[] = [];

// 			for(let i = 0; i < itemVals.length; i++){
// 				newRowOptions.push(itemFn(itemVals[i]))
// 			}

// 			return newRowOptions;
// 		}

// 		return null;
// 	})

// 	return copyItem;
// }

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