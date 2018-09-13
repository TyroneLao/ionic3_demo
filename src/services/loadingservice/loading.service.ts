import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

/**
 * loading提示服务类
 * author: tyrone lao
 */
@Injectable()
export class LoadingService {

    constructor(public loadingCtrl : LoadingController ){

    }
/**
 *   loading('内容',callback?)
 *   loading('option类',callback?)
 * ##options
         选项      |   类型    | 描述
        ---------  |--------  |------------
        spinner    |  string  | The name of the SVG spinner for the loading indicator.
        content    |  string  | The html content for the loading indicator.
        cssClass   |  string  | Additional classes for custom styles, separated by spaces.
        showBackdrop |  boolean  | Whether to show the backdrop. Default true.
        enableBackdropDismiss   |  boolean   | boolean	Whether the loading indicator should be dismissed by tapping the backdrop. Default false.
        dismissOnPageChange  |  boolean   | Whether to dismiss the indicator when navigating to a new page. Default false.
        duration   |  number   | How many milliseconds to wait before hiding the indicator. By default, it will show until dismiss() is called.
  Learn more  http://ionicframework.com/docs/api/components/loading/LoadingController/



  ### Simple Example
  element={
      content: "Please wait...",
      duration: 3000
    }


  element={
        spinner: 'hide',//隐藏图标
        content: 'Loading Please Wait...',
        duration: 5000
      }

   public showLoading() : void {

      let loadEle={
        // spinner: 'hide',
        content: 'Loading Please Wait...',
        duration: 1000
      };
      let cancelCallback = function(){
        console.log('关闭');
      };
      this.loadingService.loading(loadEle,cancelCallback);

      // let loading = this.loadingService.getLoading(loadEle);
      // loading.onDidDismiss(()=>{
      //   console.log("Toast DidDismiss");
      // });
      // loading.present();
    }

  手动隐藏 loading.dismiss();
 * ##使用方法
 * ####1.1在module中的providers中声明，(全局使用)
 * ####1.2在@component中添加上元数据  providers: [LoadingService](局部使用)
 * ####3.在constructor中注入
 *   constructor(public loadingService : LoadingService ) {
    }
 *
 */
    loading(options: string|object,callback?) : any {
        let loader;
        let isObject: boolean=false;
        let optionbak : object;
        let optionDefault={
            content:"",
            duration: 2000
          }
        if(typeof options=="string"){
            optionDefault.content=options.toString();
        }else if(typeof options == 'object'){
            isObject=true;
            optionbak=options;
        }
        loader= this.loadingCtrl.create(isObject?optionbak:optionDefault);
        if(callback){
            loader.onDidDismiss(callback);
        }
        loader.present();
        return loader;
    }


    getLoading(options:object,): any {
        let loader = this.loadingCtrl.create(options);
        return loader;
    }
}
