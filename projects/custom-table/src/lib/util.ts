import _ from "lodash" // Import the entire lodash library
import { Subscription } from 'rxjs';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { BaseTableComponent } from './components/table/base-table/base-table.component';
import { MaterialMenuItem } from './components/material/material-menu-item/material-menu-item.component';
import { State, FilterDescriptor, ParamConfig, SelectItem, CheckboxEvent, BaseEventOptionsI } from './table-api';
import { BaseEventComponent } from "./components/table/base-event/base-event.component";

// setColumnFilterValue sets the column filter reference values in table passed with
// the values found in map passed
export function setColumnFilterValue(baseTable: BaseTableComponent, fieldMap: Map<string, SelectItem[]>, state?: State) {
    for (let i = 0; i < baseTable.columnFilterCrs.length; i++) {
        const columnField = baseTable.columnFilterCrs[i].instance.field;

        if (fieldMap.has(columnField)) {
            baseTable.columnFilterCrs[i].instance.value = fieldMap.get(columnField);
        }

        if (state) {
            const filters = state.filter.filters as FilterDescriptor[];

            filters.forEach(x => {
                if (x.field == columnField) {
                    console.log('found field!');
                    console.log(x.field);
                    baseTable.columnFilterCrs[i].instance.selectedValue = x.value;
                    console.log('some selected val')
                    console.log(baseTable.columnFilterCrs[i].instance.selectedValue)
                }
            })
        }
    }
}

export function defaultProcessError(err: any) {
    let val = err as HttpErrorResponse;

    console.log(val);

    if (val.status == 0) {
        alert("Can't connect to server, do you have an internet connection?")
    } else {
        alert('Server error');
    }
}

// setJSONFieldValue is used to take passed field parameter, which can be a "." 
// seperated string that represents access to json object field and apply
// the passed val to the passed data object
export function setJSONFieldValue(field: string, data: Object, val: any) {
    let fields = field.split(".");
    let obj = {}

    for (let i = 0; i < fields.length; i++) {
        if (i == fields.length - 1) {
            data[fields[i]] = val;
        } else {
            obj = data[fields[i]];
        }
    }
}

// getJSONFieldValue is used to take passed field parameter, which can be a "." 
// seperated string that represents access to json object field and get access
// to value of passed field from passed data object
export function getJSONFieldValue(field: string, data: Object): any {
    const fields = field.split(".");
    let obj = {}
    let val: any;

    for (let i = 0; i < fields.length; i++) {
        if (i == fields.length - 1) {
            val = data[fields[i]]
        } else {
            obj = data[fields[i]];
        }
    }

    return val;
}

export function encodeURIState(state: State, cfg: ParamConfig): string {
    let url = '?'

    if (state.take != undefined && cfg.take != undefined) {
        url += cfg.take + '=' + state.take.toString() + '&';
    }
    if (state.skip != undefined && cfg.skip != undefined) {
        url += cfg.skip + '=' + state.skip.toString() + '&';
    }
    if (state.filter != undefined) {
        const filters = state.filter.filters;

        if (filters != undefined && cfg.filters != undefined) {
            url += cfg.filters + '=' + encodeURI(JSON.stringify(filters)) + '&';
        }
    }
    if (state.group != undefined && cfg.groups != undefined) {
        url += cfg.groups + '=' + encodeURI(JSON.stringify(state.group)) + '&';
    }
    if (state.sort != undefined && cfg.sorts != undefined) {
        url += cfg.sorts + '=' + encodeURI(JSON.stringify(state.sort)) + '&';
    }

    if (url == '?') {
        return '';
    }

    return url;
}

export function instanceOfCheckboxEvent(object: any): object is CheckboxEvent {
    return 'isHeaderCheckbox' in object
}

export function instanceOfMaterialMenuItem(object: any): object is MaterialMenuItem {
    return 'childMenu' in object
}