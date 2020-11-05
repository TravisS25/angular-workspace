import { Directive, Input } from '@angular/core';
import { Checkbox } from 'primeng/checkbox';

@Directive({
  selector: '[columnCheckbox]'
})
export class ColumnCheckboxDirective {
  @Input() public field: string

  constructor(public host: Checkbox) { }

  // public isChecked(): boolean {
  //   return true
  //   // return this.host.isChecked();
  // }

  // public value(): any {
  //   //console.log(this.host)
  //   this.host.value;
  // }

  // public setCheck(val: boolean) {
  //   this.host.checked = val;
  // }
}
