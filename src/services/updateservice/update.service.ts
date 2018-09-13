import {Injectable} from '@angular/core';
import {Platform, AlertController} from 'ionic-angular';
import {AppVersion} from '@ionic-native/app-version';
import {File} from '@ionic-native/file';
import {FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import {InAppBrowser} from '@ionic-native/in-app-browser';
import {Const} from "../../provider/const";
import {FileOpener} from "@ionic-native/file-opener";
import {ToastService} from "../toastservice/toast.service";

@Injectable()
export class UpdateService {

  public platformVersion:string='';

  constructor(private platform: Platform,
              private alertCtrl: AlertController,
              private transfer: FileTransfer,
              private appVersion: AppVersion,
              private file: File,
              private fileOpener: FileOpener,
              private inAppBrowser: InAppBrowser,
              private toast:ToastService) {
    this.platformVersion=localStorage.getItem("platformVersion");
  }


  /**
   * 检查app是否需要升级

  detectionUpgrade() {
    //这里连接后台获取app最新版本号,然后与当前app版本号(this.getVersionNumber())对比
    //版本号不一样就需要申请,不需要升级就return
    this.alertCtrl.create({
      title: '升级',
      subTitle: '发现新版本,是否立即升级？',
      buttons: [{text: '取消'},
        {
          text: '确定',
          handler: () => {
            this.downloadApp();
          }
        }
      ]
    }).present();
  }*/

  /**
   * 下载安装app
   */
  downloadApp(apkDownloadUrl) {
    // console.log(this.platform.is('mobileweb'));
    // console.log('下载地址'+apkDownloadUrl);
    // console.log('本地地址'+this.file.externalApplicationStorageDirectory);
    // console.log('本地地址externalRootDirectory'+this.file.externalRootDirectory);

    if (this.isAndroid()) {
      // if(this.platformVersion>'7.0.0'){
      //   this.openUrlByBrowser(apkDownloadUrl);
      // }else{
        let alert = this.alertCtrl.create({
          title: '下载进度：0%',
          enableBackdropDismiss: false,
          buttons: ['后台下载']
        });
        alert.present();

        const fileTransfer: FileTransferObject = this.transfer.create();
        const apk = this.file.externalApplicationStorageDirectory + 'staff.apk';
        //this.file.externalApplicationStorageDirectory file:///storage/emulated/0/Android/data/com.grgbanking.staff/
        //apk保存的目录 this.file.externalRootDirectory file:///storage/emulated/0/ 这个目录会出现权限出错的问题

        fileTransfer.download( apkDownloadUrl, apk).then((entry) => {
          console.log('download complete: ' + entry.toURL());
          this.fileOpener.open(apk.replace('file://', ''),'application/vnd.android.package-archive').then(()=>{});

        }, (error) => {
          alert.dismiss();
          this.toast.toast('下载失败！')
          console.log('出错: ' ,error);
        });

        fileTransfer.onProgress((event: ProgressEvent) => {
          console.log(event);
          let num = Math.floor(event.loaded / event.total * 100);
          if (num === 100) {
            alert.dismiss();
          } else {
            let title = document.getElementsByClassName('alert-title')[0];
            title && (title.innerHTML = '下载进度：' + num + '%');
          }
        });

      }


    // }

    if (this.isIos()) {
      this.openUrlByBrowser(Const.IOS_DOWNLOAD);
    }
    // if (this.platform.is('mobileweb')) {//浏览器
    //   console.log('是浏览器');
    //   this.openUrlByBrowser(apkDownloadUrl);
    // }


  }

  /**
   * 通过浏览器打开url
   */
  openUrlByBrowser(url:string):void {
    this.inAppBrowser.create(url, '_system');
  }

  /**
   * 是否浏览器环境
   * @return {boolean}
   */
  isBrowser(): boolean {
    return this.platform.is('mobile') && !this.platform.is('mobileweb');
  }

  /**
   * 是否真机环境
   * @return {boolean}
   */
  isMobile(): boolean {
    return this.platform.is('mobile') && !this.platform.is('mobileweb');
  }

  /**
   * 是否android真机环境
   * @return {boolean}
   */
  isAndroid(): boolean {
    return this.isMobile() && this.platform.is('android');
  }

  /**
   * 是否ios真机环境
   * @return {boolean}
   */
  isIos(): boolean {
    return this.isMobile() && (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone'));
  }

  /**
   * 获得app版本号,如0.01
   * @description  对应/config.xml中version的值
   * @returns {Promise<string>}
   */
  getVersionNumber(): Promise<string> {
    return new Promise((resolve) => {
      this.appVersion.getVersionNumber().then((value: string) => {
        resolve(value);
      }).catch(err => {
        console.log('getVersionNumber:' + err);
      });
    });
  }

//openfile需要知道文件的 MIMEType，下面是获取文件MIMEType
  getFileMimeType(fileType: string): string {
    let mimeType: string = '';

    switch (fileType) {
      case 'apk':
        mimeType= 'application/vnd.android.package-archive';
        break;
      case 'txt':
        mimeType = 'text/plain';
        break;
      case 'docx':
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case 'doc':
        mimeType = 'application/msword';
        break;
      case 'pptx':
        mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        break;
      case 'ppt':
        mimeType = 'application/vnd.ms-powerpoint';
        break;
      case 'xlsx':
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      case 'xls':
        mimeType = 'application/vnd.ms-excel';
        break;
      case 'zip':
        mimeType = 'application/x-zip-compressed';
        break;
      case 'rar':
        mimeType = 'application/octet-stream';
        break;
      case 'pdf':
        mimeType = 'application/pdf';
        break;
      case 'jpg':
        mimeType = 'image/jpeg';
        break;
      case 'png':
        mimeType = 'image/png';
        break;
      default:
        mimeType = 'application/' + fileType;
        break;
    }
    return mimeType;
  }
}
