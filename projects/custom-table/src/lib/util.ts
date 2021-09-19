import { SelectItem, Message } from 'primeng/api';
import _ from "lodash" // Import the entire lodash library
import { Subscription } from 'rxjs';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { BaseTableComponent } from './components/base-table/base-table.component';
import { CheckboxEvent, MaterialMenuItem } from '../public-api';
import { State, FilterDescriptor } from './table-api';

// setColumnFilterValue sets the column filter reference values in table passed with
// the values found in map passed
//
// This is intended to mainly be used in BaseTableConfig#tableSettingsAPIConfig#processResult function
export function setColumnFilterValue(baseTable: BaseTableComponent, fieldMap: Map<string, SelectItem[]>, state?: State) {
    for (let i = 0; i < baseTable.columnFilterCrs.length; i++) {
        // fieldMap.forEach((v, k) => {
        //     if (baseTable.columnFilterCrs[i].instance.field == k) {
        //         baseTable.columnFilterCrs[i].instance.value = v;
        //     }
        // });

        let columnField = baseTable.columnFilterCrs[i].instance.field;

        if (fieldMap.has(columnField)) {
            baseTable.columnFilterCrs[i].instance.value = fieldMap.get(columnField);
        }

        if (state) {
            let filters = state.filter.filters as FilterDescriptor[];

            filters.forEach(x => {
                if (x.field == columnField) {
                    baseTable.columnFilterCrs[i].instance.selectedValue = x.value;
                }
            })
        }
    }
}

export function makeID(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
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
    let fields = field.split(".");
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

export function instanceOfCheckboxEvent(object: any): object is CheckboxEvent {
    return 'isHeaderCheckbox' in object
}

export function instanceOfMaterialMenuItem(object: any): object is MaterialMenuItem {
    return 'childMenu' in object
}