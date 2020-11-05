import { SelectItem, Message } from 'primeng/api';
import _ from "lodash" // Import the entire lodash library
import { Subscription } from 'rxjs';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { BaseTableComponent } from './components/base-table/base-table.component';
import { FilterData, Column, CreateActionConfig } from './table-api';
import { DialogService } from 'primeng/dynamicdialog';

export function defaultProcessTableResult(result: any, baseTable: BaseTableComponent){

}

export function setColumnFilterValue(baseTable: BaseTableComponent, fieldMap: Map<string, SelectItem[]>){
	for(let i = 0; i < baseTable.columnFilterCrs.length; i++){
		fieldMap.forEach((v, k) => {
			if(baseTable.columnFilterCrs[i].instance.field == k){
				baseTable.columnFilterCrs[i].instance.value = v;
			}
		});
	}
}

export function defaultProcessError(err: any){
    let val = err as HttpErrorResponse;

    console.log(val);

    if(val.status == 0){
        alert("Can't connect to server, do you have an internet connection?")
    } else{
        alert('Server error');
    }
}

export function createNewModal(
    outerData: any,
    dialog: DialogService, 
    buttonConfig: CreateActionConfig,  
    baseTable: BaseTableComponent, 
    sub: Subscription,
){
  if(buttonConfig.createConfig.dialogConfig.data == undefined){
    buttonConfig.createConfig.dialogConfig.data = {
      outerData: outerData,
      isCreate: true,
    }
  } else{
    buttonConfig.createConfig.dialogConfig.data['outerData'] = outerData;
    buttonConfig.createConfig.dialogConfig.data['isCreate'] = true;
  }

  const ref = dialog.open(
    buttonConfig.createConfig.component,
    buttonConfig.createConfig.dialogConfig,
  )

  if(sub != undefined && !sub.closed){
    sub.unsubscribe();
  }

  console.log('about to subscribe to create!!!')
  sub = ref.onClose.subscribe(r => {
    console.log('onclose subscribe!!!!');
    if(buttonConfig.createConfig.processOnClose != undefined){
      console.log('process on close!!!!');
      buttonConfig.createConfig.processOnClose(r, baseTable);
    }
  })
}