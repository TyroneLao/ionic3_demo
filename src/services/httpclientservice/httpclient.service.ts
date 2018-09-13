import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHandler, HttpHeaders, HttpParams} from '@angular/common/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/first';
import {LocalStorage} from "../../decorator/storage.decorator";
import {Const} from "../../provider/const";
import {App, InfiniteScroll, LoadingController, NavController, Refresher} from "ionic-angular";
import {ToastService} from "../toastservice/toast.service";
import {NativeService} from "../nativeservice/native.service";
import {UtilService} from "../utilservice/util.service";
import {Device} from "@ionic-native/device";

export interface HttpOptions {
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  observe: 'body';
  params?: HttpParams | {
    [param: string]: string | string[];
  };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
}


@Injectable()
export class HttpClientService extends HttpClient {
  //请求体中的规范信息
  public reqHead = {
    version: '',//APP版本
    platform: '',//手机系统
    token: '',//安全令牌

  }
  navCtrl;


  @LocalStorage
  private token: string;
  @LocalStorage
  private platform: string;
  @LocalStorage
  private appVersion: string;
  @LocalStorage
  private isDebug: string;
  @LocalStorage
  private debugUrl: string;

  @LocalStorage
  private intervalID: string;//用于存储setInterval 返回的id，用于清除定时任务

  constructor(handler: HttpHandler, public loadingCtrl: LoadingController,public device: Device,
              public appCtrl: App, public toast: ToastService, public nativeService: NativeService, public utilService: UtilService) {
    super(handler);

  }

  /**    --------------------------------
   *          Standard HTTP requests
   *     --------------------------------
   */
  public getJson<T>(uri: string): Observable<T> {
    return super.get<T>(this.getUrl(uri), <HttpOptions>this.getOptions());
  }

  public postJSON<T>(uri: string, data: Object): Observable<T> {
    return super.post<T>(this.getUrl(uri), data, <HttpOptions>this.getOptions());
  }

  public putJson<T>(uri: string, data: Object): Observable<T> {
    return super.put<T>(this.getUrl(uri), data, <HttpOptions>this.getOptions());
  }

  public patchJson<T>(uri: string, data: any): Observable<T> {
    return super.patch<T>(this.getUrl(uri), data, <HttpOptions>this.getOptions());
  }

  public headJson<T>(uri: string): Observable<T> {
    return super.head<T>(this.getUrl(uri), <HttpOptions>this.getOptions());
  }

  public deleteJson<T>(uri: string): Observable<T> {
    return super.delete<T>(this.getUrl(uri), <HttpOptions>this.getOptions());
  }

  public optionsJson<T>(uri: string): Observable<T> {
    return super.options<T>(this.getUrl(uri), <HttpOptions>this.getOptions());
  }

  /**    --------------------------------
   *          Custom HTTP requests
   *     --------------------------------
   */
  public httpClientGet(uri: string) {

    return super.get(this.getUrl(uri), <HttpOptions>this.getOptions());
  }

  public httpClientPost(uri: string, params: Object, callback: Function, loader?: boolean, refresherOrInfiniteScroll?: Refresher | InfiniteScroll) {
    let loading = this.loadingCtrl.create();
    if (loader) {
      loading.present();
    }
    this.getHead();
    let data = {//这个处理在拦截器之前
      header: this.reqHead,
      body: params
    }
    let dataJsonStr = 'params=' + encodeURIComponent(JSON.stringify(data));
    let stream = super.post(this.getUrl(uri), dataJsonStr, <HttpOptions>this.getOptions());
    if (this.canAccess()) {
      stream.subscribe(//开始http访问
        (res: any) => {//http 请求成功后执行
          if (loader) {
            loading.dismiss();
          }
          if (refresherOrInfiniteScroll) {
            // console.log('Async operation has ended');
            refresherOrInfiniteScroll.complete();
          }
          // console.log(res.resp);
          if (res.resp && res.resp.header && res.resp.header.code == '0000') {//访问正确
            callback(res.resp);
          } else {//访问正确，但后端异常
            this.reqError(res.resp, this);
          }

        },
        (error) => {//http 请求失败后执行
          if (loader) {
            loading.dismiss();
          }
          if (refresherOrInfiniteScroll) {
            // console.log('Async operation has ended');
            refresherOrInfiniteScroll.complete();
          }
          console.log(error);
          this.handleError(error, this)
        }
        // ,
        // () => {//http 请求完成后执行（最后）
        //   if (loader) {
        //     loading.dismiss();
        //   }
        // }
      );
    } else {
      if (loader) {
        loading.dismiss();
      }
      if (refresherOrInfiniteScroll) {
        // console.log('Async operation has ended');
        refresherOrInfiniteScroll.complete();
      }
    }

  }

  public simpleHttpClientPost(uri: string, params: Object) {

    this.getHead();
    let data = {//这个处理在拦截器之前
      header: this.reqHead,
      body: params
    }
    let dataJsonStr = 'params=' + encodeURIComponent(JSON.stringify(data));
    if (this.canAccess()) {
      return super.post(this.getUrl(uri), dataJsonStr, <HttpOptions>this.getOptions());
    } else {
      return false;
    }

  }

  private canAccess(): boolean {
    if (!this.nativeService.isConnecting()) {//是否联网
      this.toast.toast('手机没有网络，请联网后再试！', () => {

      });
      return false;
    }

    return true;
  }

  /**
   * 拼接Url
   *
   * @param {string} uri
   * @returns {string}
   */
  private getUrl(uri: string): string {
    if (this.isDebug == "YES") {
      return "http://" + this.debugUrl + "/tom/mobile" + uri;
    } else {
      return Const.DOMAIN + uri;
    }
  }

  /**
   * 构造http的配置
   *
   * @returns {HttpOptions}
   */
  private getOptions(data?) {
    let headers = new HttpHeaders();
    //HttpHeaders类是不可变对象（immutable），所以每个set()都会返回一个新实例，并且应用上这些修改。
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    // headers = headers.append('Authorization', `Bearer ${this.token.access_token}`);
    // headers = headers.append("Access-Control-Allow-Origin", "*");
    // console.log(headers)
    const options = {
      headers: headers,
      observe: 'body',// body 只获取响应的body信息 response 获取响应的完整信息（如body，header，status等）
      params: (data) ? new HttpParams({
        fromObject: data
      }) : new HttpParams(),
      reportProgress: true,
      responseType: 'json',
      withCredentials: true
    };

    return options;
  }

  public goUpdate() {
    //广播停止上传地址
    if (this.intervalID) {//存在定时任务才清除
      clearInterval(Number(this.intervalID));
      this.intervalID = '';//清除 定时任务ID
    }

    let navCtrl = this.appCtrl.getActiveNavs()[0];
    navCtrl.setRoot('SettingPage');//首页根据localStorage中是否有token这个东西自动判断登录状态
  }

  public reqError(res, temp_this): void {

    console.log(res)
    if (res.header.msg) {
      if (res.header.code == '401') {//token失效，需要用户重新登录，这里先将登录信息清除
        this.bgModeSkipToast("登录失效，请重新登录！", this.logout());
      } else if (res.header.code == '402') {
        this.bgModeSkipToast("您的账号在其他地方登陆，请重新登陆或重置密码！", this.logout());
      } else if (res.header.code == '403') {
        this.bgModeSkipToast('版本不正确，请更新版本', this.goUpdate());
      } else {
        this.bgModeSkipToast(res.header.msg);
      }
    } else {
      this.bgModeSkipToast('未知错误，请联系管理员！');
    }
  }

  public handleError(error: Response | any, temp_this) {
    // console.log(error)
    let msg = '';
    if (error.status == 400) {
      msg = '请求无效(code：404)';
      console.log(msg + '，请检查参数类型是否匹配');
    }
    else if (error.status == 404) {
      msg = '请求资源不存在(code：404)';
      console.error(msg + '，请检查路径是否正确');
    }
    else if (error.status == 500) {
      msg = '服务器发生错误(code：500)';
      console.error(msg + '，请检查路径是否正确');
    } else {
      console.log(error);
      if (msg == '') {
        msg = '连接失败，请检查网络是否连接，如果网络已连接，请联系系统管理员';
      }
      this.bgModeSkipToast(msg);

    }

    // return Promise.reject(error.message || error);
  }

  /**
   * 公共方法
   *
   * 用于解决：当应用充后端返回前台时，积累了大量的提示信息
   * @param msg
   * @param callback
   */
  public bgModeSkipToast(msg, callback?) {
      this.toast.toast(msg, callback ? callback() : () => {});
  }

  /**
   * 清除保存的内容
   *
   */
  public logout(): void {
    console.log("注销登录")
    //广播停止上传地址
    if (this.intervalID) {//存在定时任务才清除
      clearInterval(Number(this.intervalID));
      this.intervalID = '';//清除 定时任务ID
    }
    // let navCtrl: NavController = this.appCtrl.getActiveNav();
    let navCtrl = this.appCtrl.getActiveNavs()[0];
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    if (navCtrl.getByIndex(0).name != "LoginPage") {
      navCtrl.setRoot('LoginPage');//首页根据localStorage中是否有token这个东西自动判断登录状态
    }
  }


  /**
   * 约定请求头head构造
   */
  public getHead(): void {
    this.reqHead.platform = this.platform;
    this.reqHead.token = this.token;
    this.reqHead.version = this.appVersion;
  }


}
