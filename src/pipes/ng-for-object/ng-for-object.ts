import { Pipe, PipeTransform } from '@angular/core';

/*
* *ngFor循环 遍历对象属性
* */
@Pipe({
  name: 'ngForObject',
})
export class NgForObjectPipe implements PipeTransform {
  transform(value, args:string[]) : any {
    let keys = [];
    for (let key in value) {
      keys.push({key: key, value: value[key]});
    }
    return keys;
  }
}
