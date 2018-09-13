import {Component} from '@angular/core';
import {ActionSheetController, AlertController, IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {ToastService} from "../../services/toastservice/toast.service";

import {LocalStorage} from "../../decorator/storage.decorator";

import {HttpClientService} from "../../services/httpclientservice/httpclient.service";
import {JPush} from "@jiguang-ionic/jpush";



declare let cordova;
declare let window;

@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {
  @LocalStorage
  public appVersion:string;

  @LocalStorage
  private deviceNumber: string;//设备序列号

  @LocalStorage
  public isDebug;//YES NO
  @LocalStorage
  public debugUrl="";
  public selectDebug:boolean;

  public needUpdate: boolean = false;

  public app = {
    platform: '',
    version: ''
  }
  public resp={
    url:'',
    version:''
  }

  constructor(public navCtrl: NavController, public navParams: NavParams,public jpush: JPush,
              public toastService: ToastService, public httpClient: HttpClientService,
              public  actionSheetCtrl: ActionSheetController, public platform: Platform,
              public alertCtrl: AlertController) {
    this.app.platform = localStorage.getItem("platform");
    this.app.version = localStorage.getItem("appVersion");

    if(this.isDebug=="YES"){
      this.selectDebug=true;
      if(!this.debugUrl){
        this.debugUrl="10.2.8.166:8118";
      }
    }else {
      this.selectDebug=false;
    }
    console.log(this.isDebug)
    console.log(this.selectDebug)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');
  }


  ionViewWillEnter() {
    this.httpClient.httpClientPost('/getNewVersionInfo', this.app,res => {
      // console.log(res);
      // console.log(res.body);
      this.resp = res.body;
      if (this.resp.version) {//需要更新
        this.needUpdate = this.compareVersion(this.resp.version);
      }
      console.log(this.needUpdate);
    }, false);
  }

  public compareVersion(version:string):boolean{
    let needUpdate=false;
    let latestVersion = version.split("_")[0];

    // console.log('this.currentVersion',this.appVersion)
    // console.log('latestVersion',latestVersion)
    // console.log(this.appVersion < latestVersion)

    if(this.appVersion < latestVersion){//需要更新
      needUpdate=true;
    }
    return needUpdate;
  }

  public switchDebug(){
    if(this.selectDebug){
      this.isDebug="YES";
    }else {
      this.isDebug="NO"
    }
  }

  // http://10.2.153.147:8080/sop/app-version!detectAppVersion.do
  public goToPages(pageName): void {
    if (pageName == 'Root') {
      this.navCtrl.popToRoot();
    } else {
      this.navCtrl.push(pageName, {url:this.resp.url,version:this.resp.version,needUpdate:this.needUpdate});
    }
  }


  /**
   * 清除登录内容的内容（保存用户名和密码）
   */
  public Exit(_this): void {
    localStorage.removeItem('token');

    _this.toastService.toast('退出应用！', () => {
      cordova.plugins.seaDevice.exitApp();//要延时，否则前面的数据没清除
    });
    // this.platform.exitApp();//ios 用不了

  }

  /**
   * 清除保存的内容（清除用户名和密码）
   */
  public logout(_this): void {
    localStorage.removeItem('token');
    localStorage.removeItem('loginName');
    localStorage.removeItem('password');

    _this.timingService.STOP_SUBMIT_ADDRESS();//停止定时任务

    _this.toastService.toast('注销成功！', () => {
      // _this.goToPages('LoginPage');
      _this.navCtrl.setRoot('LoginPage');
    });
  }


  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      // title: 'Modify your album',
      cssClass: 'action-sheets',
      buttons: [
        {
          text: '注销',
          handler: () => {
            console.log('注销');
            this.checkExit('注销登录', this.logout,this);
          }
        }, {

          text: '退出',
          role: 'destructive',
          handler: () => {
            console.log('退出');
            this.checkExit('退出应用', this.Exit,this);

          }
        }, {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  public checkExit(msg, callback,_this) {
    let element = {
      title: '确定' + msg + '?',
      // message: ' ！',
      buttons: [
        {
          text: '取消',
          handler: () => {
            console.log('点击了取消');
          }
        },
        {
          text: '确定',
          handler: () => {
            callback(_this);
          }
        }
      ]
    }
    let alert = _this.alertCtrl.create(element);
    alert.present();
  }





}
