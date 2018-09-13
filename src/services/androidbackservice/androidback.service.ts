import {Injectable} from '@angular/core';
import {Platform, ToastController, App, NavController, Tabs, Nav, IonicApp} from 'ionic-angular';

@Injectable()
export class AndroidBackService {

  //控制硬件返回按钮是否触发，默认false
  backButtonPressed: boolean = false;

  //构造函数 依赖注入
  constructor(public platform: Platform,
              public appCtrl: App,
              // public ionicApp: IonicApp,
              public toastCtrl: ToastController) {
  }

  //注册方法
  registerBackButtonAction(ionicApp): void {

    //registerBackButtonAction是系统自带的方法
    this.platform.registerBackButtonAction(() => {

      // this.appCtrl.
      //如果想点击返回按钮隐藏toast或loading或Overlay就把下面加上
      // this.ionicApp._toastPortal.getActive() || this.ionicApp._loadingPortal.getActive() || this.ionicApp._overlayPortal.getActive()
      //关闭modal
      let activePortal = ionicApp._modalPortal.getActive();
      if (activePortal) {
        activePortal.dismiss().catch(() => {
        });
        activePortal.onDidDismiss(() => {
        });
        return;
      }

      // //关闭toast（会影响退出应用）
      // let toastPortal = ionicApp._toastPortal.getActive();
      // if (toastPortal) {
      //   toastPortal.dismiss().catch(() => {
      //   });
      //   toastPortal.onDidDismiss(() => {
      //   });
      //   return;
      // }
      //关闭loading
      let loadingPortal = ionicApp._loadingPortal.getActive();
      if (loadingPortal) {
        loadingPortal.dismiss().catch(() => {
        });
        loadingPortal.onDidDismiss(() => {
        });
        return;
      }

      //关闭 Overlay
      let overlayPortal = ionicApp._overlayPortal.getActive();
      if (overlayPortal) {
        overlayPortal.dismiss().catch(() => {
        });
        overlayPortal.onDidDismiss(() => {
        });
        return;
      }

      //获取NavController
      let activeNav: NavController = this.appCtrl.getActiveNavs()[0];
      console.log('能否返回' + activeNav.canGoBack());

      if(activeNav.last().id=='LoginPage'){//排除登陆页，登陆页直接退出
        this.showExit();
      }else{
        //如果可以返回上一页，则执行pop
        if (activeNav.canGoBack()) {
          activeNav.pop();
        } else {
          this.showExit();
        }
      }


    });
  }


  //退出应用方法
  private showExit(): void {
    //如果为true，退出
    if (this.backButtonPressed) {
      this.platform.exitApp();
    } else {
      //第一次按，弹出Toast
      this.toastCtrl.create({
        message: '再按一次退出应用',
        duration: 2000,
        position: 'top'
      }).present();
      //标记为true
      this.backButtonPressed = true;
      //两秒后标记为false，如果退出的话，就不会执行了
      setTimeout(() => this.backButtonPressed = false, 2000);
    }
  }
}
