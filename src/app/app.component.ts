import {Component} from '@angular/core';
import {IonicApp, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {AndroidBackService} from "../services/androidbackservice/androidback.service";
import {Device} from "@ionic-native/device";
import {AppVersion} from "@ionic-native/app-version";
import {LocalStorage} from "../decorator/storage.decorator";
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import {JPush} from "@jiguang-ionic/jpush";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @LocalStorage
  private deviceNumber: string;//设备序列号
  @LocalStorage
  private platform: string;//手机系统版本 ios  Android
  @LocalStorage
  private platformVersion: string;//手机系统版本 ios  Android
  @LocalStorage
  private appVersion: string;//app 版本号 1.0.0
  @LocalStorage
  private token: string;//

  rootPage: any ;

  constructor(public Platform: Platform, public statusBar: StatusBar,
              public splashScreen: SplashScreen, public device: Device,
              public ionicApp: IonicApp,private screenOrientation: ScreenOrientation, public jpush: JPush,
              public AppVersion: AppVersion, public androidBackService: AndroidBackService) {
    if(!this.token){//未登录
      this.rootPage="LoginPage";
    }else {
      this.rootPage = "";
    }
    Platform.ready().then(() => {

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      // statusBar.styleDefault();//只用这个状态栏会变黑色
      splashScreen.hide();
      statusBar.styleLightContent();
      statusBar.overlaysWebView(false);
      statusBar.backgroundColorByHexString("#4C80F6");//设置状态栏背景


      if (this.device.platform) {
        //极光推送初始化
        this.JPushInit();

        // 设置竖屏使用
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

        // S 正式真机数据获取
        this.deviceNumber = this.device.uuid;
        this.platform = this.device.platform.toLowerCase();//转小写
        this.platformVersion = this.device.version;
        console.log('设备序列号: ', this.device.uuid);
        console.log('手机平台: ', this.device.platform);//ios  android
        console.log('系统版本: ', this.device.version);
        this.AppVersion.getVersionNumber().then(response => {
          console.log('app 版本号为: ', response);
          this.appVersion = response;
          // localStorage.setItem('appVersion', response);
        });
        // E 正式真机数据获取
      } else {
        // S 测试数据设定
        this.deviceNumber = 'testdevice';
        this.platform = 'android';
        this.platformVersion = '6.0.0';
        this.appVersion = '1.0.3';
        // E 测试数据设定
      }
      // 监听返回键
      this.androidBackService.registerBackButtonAction(ionicApp);
    });
  }

  JPushInit(){
    // 极光推送启动
    console.log('极光推送启动');
    this.jpush.init()
      .then(result => {
        console.log('极光推送初始化',JSON.stringify(result));
      });
    this.getAlias();

    //启动应用时直接清空ios角标
    if (this.platform == 'ios') {
      this.jpush.resetBadge();
      this.jpush.setApplicationIconBadgeNumber(0);
    }
    // 将后台接收到的信息加入消息列表
    document.addEventListener("jpush.backgroundNotification", (event: any) => {
      console.log("极光推送 backgroundNotification", JSON.stringify(event));

      var content;
      content = event.aps.alert;
    }, false);
    //添加前台接收推送事件
    document.addEventListener('jpush.receiveNotification', (event: any) => {
      console.log("极光推送 receiveNotification", JSON.stringify(event));

      var content;

      // 语音播放
      // this.nativeAudio.play('uniqueId1').then(()=>{
      //   console.log('播放完成');
      //   // this.nativeAudio.unload('uniqueId1').then(()=>{
      //   //   console.log('卸载完成');
      //   // },()=>{console.log('卸载失败');});
      // }, ()=>{console.log('播放失败')});

      if (this.platform == 'android') {
        content = event.alert;
      } else {
        content = event.aps.alert;
      }
    }, false);

    //添加点击推送消息事件
    document.addEventListener('jpush.openNotification', (event: any) => {
      console.log("极光推送 openNotification", JSON.stringify(event));

      var content;
      if (this.platform == 'android') {
        content = event.alert;
      } else {  // iOS

      // 设置点击通知时，更改iOS角标
        this.jpush.getApplicationIconBadgeNumber().then((badgeNum) => {
          // 将本地应用图标的角标数减1
          this.jpush.setApplicationIconBadgeNumber((badgeNum - 1));
          // 将极光服务器上面的角标数减1 resetBadge 相当于 setBadge(0)。
          this.jpush.setBadge((badgeNum - 1)>0?(badgeNum - 1):0);
        });
        if (event.aps == undefined) { // 本地通知
          content = event.content;
        } else {  // APNS
          content = event.aps.alert;
        }
      }
      // alert('open notification: ' + JSON.stringify(event));
    }, false);

    //添加本地接收推送消息事件
    document.addEventListener('jpush.receiveLocalNotification', (event: any) => {
      console.log("极光推送 receiveLocalNotification", JSON.stringify(event));
      // iOS(*,9) Only , iOS(10,*) 将在 jpush.openNotification 和 jpush.receiveNotification 中触发。
      var content;
      if (this.platform == 'android') {
      } else {
        content = event.content;
      }
      // this.nativeAudio.play('uniqueId1').then(()=>{
      //   console.log('播放完成');
      //   // this.nativeAudio.unload('uniqueId1').then(()=>{
      //   //   console.log('卸载完成');
      //   // },()=>{console.log('卸载失败');});
      // }, ()=>{console.log('播放失败')});
      if (this.platform == 'android') {
        content = event.alert;
      } else {
        content = event.aps.alert;
      }
      // alert('receive local notification: ' + JSON.stringify(event));
    }, false);

  }
  getAlias() {
    this.jpush.getAlias({ sequence: Number(this.deviceNumber)?Number(this.deviceNumber):1})
      .then((result)=>{
      console.log("获取极光推送别名",JSON.stringify(result))
      })
      .catch((res)=>{
        console.log("获取极光推送别名失败",res)
      });
  }
}

