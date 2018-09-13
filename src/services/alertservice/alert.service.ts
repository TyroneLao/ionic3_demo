import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

/**
 * alert提示服务类
 * author: tyrone lao
 */
@Injectable()
export class AlertService {

    constructor( public alertCtrl : AlertController, ){

    }
    /**
     *  alert(‘内容’,"标题"?)
     *  alert(option类)
     *
     * 如果传了option 对象，那就忽略title，用option来初始化alert，
     *
     *
     * ##options
         选项     |   类型    | 描述
        ---------|--------  |------------
        title    |  string  | 标题
        subTitle |  string  | 第二标题
        message  |  string  | 内容
        cssClass |  string  | 样式
        inputs   |  array   | 输入，单选项，多选项
        buttons  |  array   | 按钮
        enableBackdropDismiss  |  boolean   | 是否允许通过点击背景来关闭警告框。 默认值为true。

      Learn more http://ionicframework.com/docs/api/components/alert/AlertController/


      ### Simple Example
      #### Basic 标题，内容，确定.
      element={
         title: 'New Friend!',
         subTitle: 'Your friend, Obi wan Kenobi, just accepted your friend request!',
         buttons: ['OK']
      }

      #### Prompt 标题，内容，输入，取消，确定.

        element={
        title: 'Login',
        message: "Enter a name for this new album you're so keen on adding",
        inputs: [
            {
            name: 'title',
            placeholder: 'Title'
            },
        ],
        buttons: [
            {
            text: 'Cancel',
            handler: data => {
                console.log('Cancel clicked');
            }
            },
            {
            text: 'Save',
            handler: data => {
                console.log('Saved clicked');
            }
            }
        ]

        }

      #### Confirmation 标题，内容，取消，确定.

      element={

      title: 'Use this lightsaber?',
      message: 'Do you agree to use this lightsaber to do good across the intergalactic galaxy?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            console.log('Agree clicked');
          }
        }
      ]

    }

  #### Radio 标题，单选，取消，确定.
     let cancelCallback=function(data){
        console.log('点击了取消',data);
      }
     let callback=function(data){
        console.log('点击了确定',data);
      }
      element={
       title: 'Use this lightsaber?',
       message: 'Do you agree to use this lightsaber to do good across the intergalactic galaxy?',
       inputs: [
        {
          type: 'radio',
          label: 'Blue',
          value: 'blue',
          checked: true
        },
        {
          type: 'radio',
          label: 'yellow',
          value: 'yellow',
          checked: false
        }
       ],
        buttons:[
           {text:'确定',handler:data=>{ callback(data); }},
           {text:'取消',handler:data=>{ cancelCallback(data); }}
          ]

      }

      #### Checkbox 标题，多选，取消，确定.

      element={

      title: 'Use this lightsaber?',
       message: 'Do you agree to use this lightsaber to do good across the intergalactic galaxy?',
       inputs: [
        {
          type: 'checkbox',
          label: 'Blue',
          value: 'blue',
          checked: true //默认选择
        },
        {
          type: 'checkbox',
          label: 'yellow',
          value: 'yellow',
          checked: false
        }
       ],
        buttons:[
           {text:'确定',handler:data=>{ cancelCallback(data); }},
           {text:'取消',handler:data=>{ callback(data); }}
          ]

      }
 * * ##使用方法
 * ####1.1在module中的providers中声明，(全局使用)
 * ####1.2在@component中添加上元数据  providers: [AlertService](局部使用)
 * ####2.在constructor中注入
 *   constructor(public alertService : AlertService ) {
    }
  */
   // 方法重载
  //  function overloadFunc(x: { p1: string }): string;
  //  function overloadFunc(x: number): number;
  //  function overloadFunc(x): any {
  //      if (typeof x == 'object') {
  //          return x.p1;
  //      }

  //    if (typeof x == 'number') {
  //         return x;
  //    }
  // }
    // alert(options:string):any;
    alert(options:string|object,title? : string) : any {//options 代表内容或者初始化alert 的object
      let alert;
      let isObject: boolean=false;
      let optionbak:object;

      let optionDefault={
        title:title ? title:'温馨提示',
        message:''
      }
      if (typeof options == 'string') {
        optionDefault.message=options.toString();
      }else if(typeof options == 'object'){
        isObject=true;
        optionbak=options;
      }
      alert=this.alertCtrl.create(isObject?optionbak:optionDefault);
      alert.present();
      return alert;
    }

    public getAlert(options:object):any{
        let alert = this.alertCtrl.create(options);
        return alert;
    }

}
