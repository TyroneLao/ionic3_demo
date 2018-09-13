import {Injectable} from '@angular/core';
import {ToastController} from 'ionic-angular';


/**
 * toast提示服务类
 * author: tyrone lao
 */
@Injectable()
export class ToastService {

  private timeOutId:number;
  constructor(public toastCtrl: ToastController) {

  }

  /**
   * toast('内容',callback?)
   * toast(option 类,callback?)
   *
   * ##options
   选项       |   类型    |  默认值  | 描述
   ---------   |--------  |------------
   message     |  string  |          | The message for the toast. Long strings will wrap and the toast container will expand.
   duration    |  number  |          | The message for the toast. Long strings will wrap and the toast container will expand.
   position    |  string  | "bottom" | How many milliseconds to wait before hiding the toast. By default, it will show until dismiss() is called.
   cssClass    |  string  |          | Whether to show the backdrop. Default true.
   showCloseButton     |  boolean |  false     |    Whether or not to show a button to close the toast.
   closeButtonText     |  string  |  "Close"   |  Text to display in the close button.
   dismissOnPageChange |  boolean |       | Whether to dismiss the toast when navigating to a new page.
   Learn more  http://ionicframework.com/docs/api/components/toast/ToastController/

   ### Simple Example
   public showToast() : void {

      let toastEle={
        message: 'User was added successfully',
        duration: 3000,
        position: 'top'
      };
      let cancelCallback = function(){
        console.log('关闭');
      };
      this.toastService.toast(toastEle,cancelCallback);//和下面注释掉的功能一样

      // let toast = this.toastService.getToast(toastEle);
      // toast.onDidDismiss(()=>{
      //   console.log("Toast DidDismiss");
      // });
      // toast.present();
    }
   * ##使用方法
   * ####1.1在module中的providers中声明，(全局使用)
   * ####1.2在@component中添加上元数据  providers: [ToastService](局部使用)
   * ####3.在constructor中注入
   *   constructor(public toastService : ToastService ) {
    }
   *
   */
  //返回
  toast(options: string | object, callback?): any {
    let toast;
    let isObject: boolean = false;
    let optionbak: object;
    let optionDefault = {
      message: '',
      duration: 1600,
      position: 'top',
      cssClass: 'toastText',
      // dismissOnPageChange: true,
      // showCloseButton:true,
      // closeButtonText:'关闭'
    }
    if (typeof options == 'string') {
      optionDefault.message = options.toString();
    } else if (typeof options == 'object') {
      isObject = true;
      optionbak = options;
    }
    toast = this.toastCtrl.create(isObject ? optionbak : optionDefault);
    if (callback) {
      toast.onDidDismiss(callback);
    }
    /**
     * 限制1秒只能执行一次提示
     */
    clearTimeout(this.timeOutId);
    this.timeOutId = setTimeout(function () {
      //需要执行的事件
      toast.present();
    }, 1000);

    return toast;
  }

  getToast(options: object): any {
    let toast = this.toastCtrl.create(options);
    return toast;
  }


}
