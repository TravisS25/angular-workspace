import { SelectItem, Message } from 'primeng/api';
import _ from "lodash" // Import the entire lodash library
import { Subscription } from 'rxjs';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { BaseTableComponent } from './components/base-table/base-table.component';

export function setColumnFilterValue(baseTable: BaseTableComponent, fieldMap: Map<string, SelectItem[]>) {
    for (let i = 0; i < baseTable.columnFilterCrs.length; i++) {
        fieldMap.forEach((v, k) => {
            if (baseTable.columnFilterCrs[i].instance.field == k) {
                baseTable.columnFilterCrs[i].instance.value = v;
            }
        });
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
