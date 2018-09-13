import {Injectable} from '@angular/core';
import {LocalStorage} from "../../decorator/storage.decorator";

@Injectable()
export class UtilService {


  @LocalStorage
  private lastest:string;//记录最新一次操作的时间戳

  constructor(){

  }

  /**
   * 检查一秒内是否执行过某些操作
   * 是：true  否：false
   * @returns {boolean}
   */
  public isRepeat(n?):boolean{
    n=!n?1:n;
    console.log(n)
    let oldStamp:any;
    let newStamp:any;
    oldStamp= !this.lastest?"0":this.lastest;
    // let now = new Date().toString();
    // newStamp = Date.parse(now);
    newStamp = (new Date()).valueOf().toString();

    console.log(newStamp-oldStamp)
    console.log("newStamp:"+newStamp)
    console.log("oldStamp:"+oldStamp)
    return (newStamp-oldStamp)>n*1000?false:true;
  }
}
