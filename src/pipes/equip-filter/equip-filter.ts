import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'equipFilter',
})
export class EquipFilterPipe implements PipeTransform {

  // transform(value: string, ...args) {
  //   return value.toLowerCase();
  // }

  transform(equip,searchCont) {
    let newArray = [];
    console.log(equip,searchCont);
    if(equip&&equip.length>0){
      var reg = new RegExp(searchCont);
      equip.forEach(function (e, index, data) {
        console.log(e)
        if(e.text.match(reg)||e.modelName.match(reg)){//modelName: "无线报警主机HSG2", value
          newArray.push(e);
        }
      });
    }
    return newArray;
    // return equip.filter(hero => hero.canFly);
  }
}
