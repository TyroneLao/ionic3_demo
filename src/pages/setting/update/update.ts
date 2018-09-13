import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ToastService} from "../../../services/toastservice/toast.service";
import {LoadingService} from "../../../services/loadingservice/loading.service";
import {timeout} from "rxjs/operator/timeout";

import {UpdateService} from "../../../services/updateservice/update.service";

import {LocalStorage} from "../../../decorator/storage.decorator";
import {HttpClientService} from "../../../services/httpclientservice/httpclient.service";

@IonicPage()
@Component({
  selector: 'page-update',
  templateUrl: 'update.html',
  providers: [UpdateService],
})
export class UpdatePage {
  @LocalStorage
  public appVersion: string;

  public needUpdate: boolean;//yes  需要更新  ，no  不需要更新


  public resp = {
    url: '',
    version: ''
  }

  public app = {
    platform: '',
    version: ''
  }

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public toastService: ToastService, public loadingService: LoadingService,
              public httpClient: HttpClientService, public updateService: UpdateService,
              public params: NavParams) {
    this.app.platform = localStorage.getItem("platform");
    this.app.version = localStorage.getItem("appVersion");


  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad UpdatePage');
  }

  ionViewWillEnter() {
    if (this.params.data) {//url:this.resp.url,version:this.resp.version,needUpdate:this.needUpdate
      this.needUpdate = this.params.data.needUpdate;
      this.resp.version = this.params.data.version;
      this.resp.url = this.params.data.url;
    } else {//传参失败
      this.checkUpdate();
    }
  }


  public checkUpdate(): void {
    this.httpClient.httpClientPost('/getNewVersionInfo.do', this.app, res => {
      // console.log(res);
      // console.log(res.body);
      this.resp = res.body;
      //访问成功
      setTimeout(() => {
        if (this.resp.version) {//需要更新
          this.needUpdate = this.compareVersion(this.resp.version);
        }
        // console.log(this.needUpdate);
      }, 800);

    }, true);
  }

  public compareVersion(version: string): boolean {
    let needUpdate = false;
    let latestVersion = version.split("_")[0];

    // console.log('this.currentVersion',this.appVersion)
    // console.log('latestVersion',latestVersion)
    // console.log(this.appVersion < latestVersion)

    if (this.appVersion < latestVersion) {//需要更新
      needUpdate = true;
      this.toastService.toast('请及时更新到最新版本！')
    } else {
      this.toastService.toast('已经是最新版本！')
    }
    return needUpdate;
  }

  public download(): void {
    //做平台判断
    // if (localStorage.getItem('platform') == 'ios') {//ios
    //   window.open('http://itunes.apple.com/us/app/apple-store/id1254319300');//跳转到APP商店这样即可
    //
    // } else if (localStorage.getItem('platform') == 'android') {//安卓
    //   window.open(this.updateUrl );//跳转到APP商店这样即可
    // }
    this.updateService.downloadApp(this.resp.url);
    // this.updateService.downloadApp("http://10.2.8.68:8182/upload/SSP_CUSTOMER_ANDROID/android-debug.apk");


  }

}
