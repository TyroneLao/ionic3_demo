import {Injectable} from "@angular/core";
import {ToastController, LoadingController, Platform, Loading, AlertController} from "ionic-angular";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {AppVersion} from "@ionic-native/app-version";
import {Toast} from "@ionic-native/toast";
import {File, FileEntry} from "@ionic-native/file";
import {FileTransfer, FileTransferObject} from "@ionic-native/file-transfer";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {Network} from "@ionic-native/network";
import {Diagnostic} from "@ionic-native/diagnostic";
import {Observable} from "rxjs";

import {Const} from "../../provider/const";




@Injectable()
export class NativeService {

  private loading: Loading;
  private loadingIsOpen: boolean = false;

  constructor(private platform: Platform,
              private toastCtrl: ToastController,
              private alertCtrl: AlertController,
              private statusBar: StatusBar,
              private splashScreen: SplashScreen,
              private appVersion: AppVersion,
              private toast: Toast,
              private transfer: FileTransfer,
              private file: File,
              private inAppBrowser: InAppBrowser,
              private network: Network,
              // private cn: CallNumber,
              private diagnostic: Diagnostic,) {
  }


  /**
   * 状态栏
   */
  statusBarStyle(): void {
    if (this.isMobile()) {
      this.statusBar.overlaysWebView(false);
      this.statusBar.styleLightContent();
      this.statusBar.backgroundColorByHexString('#488aff');
    }
  }

  /**
   * 隐藏启动页面
   */
  splashScreenHide(): void {
    this.isMobile() && this.splashScreen.hide();
  }

  /**
   * 获取网络类型 如`unknown`, `ethernet`, `wifi`, `2g`, `3g`, `4g`, `cellular`, `none`
   */
  getNetworkType(): string {
    if (!this.isMobile()) {
      return 'wifi';
    }
    return this.network.type;
  }

  /**
   * 判断是否有网络
   */
  isConnecting(): boolean {
    return this.getNetworkType() != 'none';
  }


  /**
   * 通过浏览器打开url
   */
  openUrlByBrowser(url: string): void {
    this.inAppBrowser.create(url, '_system');
  }

  /**
   * 下载安装app
   */
  downloadApp(ANDROID_DOWNLOAD): void {
    if (this.isIos()) {//ios打开网页下载
      this.openUrlByBrowser(Const.IOS_DOWNLOAD);
    }
    if (this.isAndroid()) {//android本地下载
      this.externalStoragePermissionsAuthorization().subscribe(() => {
        let backgroundProcess = false;//是否后台下载
        let alert = this.alertCtrl.create({//显示下载进度
          title: '下载进度：0%',
          enableBackdropDismiss: false,
          buttons: [{
            text: '后台下载', handler: () => {
              backgroundProcess = true;
            }
          }
          ]
        });
        alert.present();
        const fileTransfer: FileTransferObject = this.transfer.create();
        const apk = this.file.externalRootDirectory + 'download/' + `android_tom.apk`; //apk保存的目录
        //下载并安装apk
        fileTransfer.download(ANDROID_DOWNLOAD, apk).then(() => {
          window['install'].install(apk.replace('file://', ''));
        }, err => {
          // this.globalData.updateProgress = -1;
          alert.dismiss();
          console.log(err, 'android app 本地升级失败');
          this.alertCtrl.create({
            title: '前往网页下载',
            subTitle: '本地升级失败',
            buttons: [
              {
                text: '确定',
                handler: () => {
                  this.openUrlByBrowser(ANDROID_DOWNLOAD);//打开网页下载
                }
              }
            ]
          }).present();
        });

        let timer = null;//由于onProgress事件调用非常频繁,所以使用setTimeout用于函数节流
        fileTransfer.onProgress((event: ProgressEvent) => {
          let progress = Math.floor(event.loaded / event.total * 100);//下载进度
          // this.globalData.updateProgress = progress;
          if (!backgroundProcess) {
            if (progress === 100) {
              alert.dismiss();
            } else {
              if (!timer) {
                timer = setTimeout(() => {
                  clearTimeout(timer);
                  timer = null;
                  let title = document.getElementsByClassName('alert-title')[0];
                  title && (title.innerHTML = `下载进度：${progress}%`);
                }, 1000);
              }
            }
          }
        });
      })
    }
  }


  /**
   * 是否真机环境
   */
  isMobile(): boolean {
    return this.platform.is('mobile') && !this.platform.is('mobileweb');
  }

  /**
   * 是否android真机环境
   */
  isAndroid(): boolean {
    return this.isMobile() && this.platform.is('android');
  }

  /**
   * 是否ios真机环境
   */
  isIos(): boolean {
    return this.isMobile() && (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone'));
  }

  /**
   * 一个确定按钮的alert弹出框.
   * @type {(title: string, subTitle?: string, message?: string) => void}
   */
  alert = (() => {
    let isExist = false;
    return (title: string, subTitle: string = '', message: string = ''): void => {
      if (!isExist) {
        isExist = true;
        this.alertCtrl.create({
          title: title,
          subTitle: subTitle,
          message: message,
          buttons: [{
            text: '确定', handler: () => {
              isExist = false;
            }
          }],
          enableBackdropDismiss: false
        }).present();
      }
    };
  })();

  /**
   * 统一调用此方法显示提示信息
   * @param message 信息内容
   * @param duration 显示时长
   */
  showToast(message: string = '操作完成', duration: number = 2000): void {
    if (this.isMobile()) {
      this.toast.show(message, String(duration), 'center').subscribe();
    } else {
      this.toastCtrl.create({
        message: message,
        duration: duration,
        position: 'middle',
        showCloseButton: false
      }).present();
    }
  };


  /**
   * 关闭loading
   */
  hideLoading(): void {
    //todo 使用 APP空间判断是否开启Loading
    if (this.loadingIsOpen) {
      setTimeout(() => {
        this.loading.dismiss();
        this.loadingIsOpen = false;
      }, 200);
    }
  };


  /**
   * 获得app版本号,如0.01
   * @description  对应/config.xml中version的值
   */
  getVersionNumber(): Observable<string> {
    return Observable.create(observer => {
      this.appVersion.getVersionNumber().then((value: string) => {
        observer.next(value);
      }).catch(err => {
        console.log(err, '获得app版本号失败');
      });
    });
  }

  /**
   * 获得app name,如现场作业
   * @description  对应/config.xml中name的值
   */
  getAppName(): Observable<string> {
    return Observable.create(observer => {
      this.appVersion.getAppName().then((value: string) => {
        observer.next(value);
      }).catch(err => {
        console.log(err, '获得app name失败');
      });
    });
  }

  /**
   * 获得app包名/id,如com.kit.ionic2tabs
   * @description  对应/config.xml中id的值
   */
  getPackageName(): Observable<string> {
    return Observable.create(observer => {
      this.appVersion.getPackageName().then((value: string) => {
        observer.next(value);
      }).catch(err => {
        console.log(err, '获得app包名失败');
      });
    });
  }


  //检测app位置服务是否开启
  private assertLocationService = (() => {
    let enabledLocationService = false;//手机是否开启位置服务
    return () => {
      return Observable.create(observer => {
        if (enabledLocationService) {
          observer.next(true);
        } else {
          this.diagnostic.isLocationEnabled().then(enabled => {
            if (enabled) {
              enabledLocationService = true;
              observer.next(true);
            } else {
              enabledLocationService = false;
              this.alertCtrl.create({
                title: '您未开启位置服务',
                subTitle: '正在获取位置信息',
                buttons: [{text: '取消'},
                  {
                    text: '去开启',
                    handler: () => {
                      this.diagnostic.switchToLocationSettings();
                    }
                  }
                ]
              }).present();
              observer.error(false);
            }
          }).catch(err => {
            console.log(err, '调用diagnostic.isLocationEnabled方法失败');
            observer.error(false);
          });
        }
      });
    };
  })();

  //检测app是否有定位权限
  private assertLocationAuthorization = (() => {
    let locationAuthorization = false;
    return () => {
      return Observable.create(observer => {
        if (locationAuthorization) {
          observer.next(true);
        } else {
          this.diagnostic.isLocationAuthorized().then(res => {
            if (res) {
              locationAuthorization = true;
              observer.next(true);
            } else {
              locationAuthorization = false;
              this.diagnostic.requestLocationAuthorization('always').then(res => {//请求定位权限
                if (res == 'DENIED_ALWAYS') {//拒绝访问状态,必须手动开启
                  locationAuthorization = false;
                  this.alertCtrl.create({
                    title: '缺少定位权限',
                    subTitle: '请在手机设置或app权限管理中开启',
                    buttons: [{text: '取消'},
                      {
                        text: '去开启',
                        handler: () => {
                          this.diagnostic.switchToSettings();
                        }
                      }
                    ]
                  }).present();
                  observer.error(false);
                } else {
                  locationAuthorization = true;
                  observer.next(true);
                }
              }).catch(err => {
                console.log(err, '调用diagnostic.requestLocationAuthorization方法失败');
                observer.error(false);
              });
            }
          }).catch(err => {
            console.log(err, '调用diagnostic.isLocationAvailable方法失败');
            observer.error(false);
          });
        }
      });
    };
  })();

  //检测app是否有读取存储权限
  private externalStoragePermissionsAuthorization = (() => {
    let havePermission = false;
    return () => {
      return Observable.create(observer => {
        if (havePermission) {
          observer.next(true);
        } else {
          let permissions = [this.diagnostic.permission.READ_EXTERNAL_STORAGE, this.diagnostic.permission.WRITE_EXTERNAL_STORAGE];
          this.diagnostic.getPermissionsAuthorizationStatus(permissions).then(res => {
            if (res.READ_EXTERNAL_STORAGE == 'GRANTED' && res.WRITE_EXTERNAL_STORAGE == 'GRANTED') {
              havePermission = true;
              observer.next(true);
            } else {
              havePermission = false;
              this.diagnostic.requestRuntimePermissions(permissions).then(res => {//请求权限
                if (res.READ_EXTERNAL_STORAGE == 'GRANTED' && res.WRITE_EXTERNAL_STORAGE == 'GRANTED') {
                  havePermission = true;
                  observer.next(true);
                } else {
                  havePermission = false;
                  this.alertCtrl.create({
                    title: '缺少读取存储权限',
                    subTitle: '请在手机设置或app权限管理中开启',
                    buttons: [{text: '取消'},
                      {
                        text: '去开启',
                        handler: () => {
                          this.diagnostic.switchToSettings();
                        }
                      }
                    ]
                  }).present();
                }
              }).catch(err => {
                console.log(err, '调用diagnostic.requestRuntimePermissions方法失败');
              });
            }
          }).catch(err => {
            console.log(err, '调用diagnostic.getPermissionsAuthorizationStatus方法失败');
          });
        }
      });
    };
  })();


}

interface Position {
  lng: string,
  lat: string
}
