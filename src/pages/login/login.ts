import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {ToastService} from "../../services/toastservice/toast.service";
import {HttpClientService} from "../../services/httpclientservice/httpclient.service";
import {LocalStorage} from "../../decorator/storage.decorator";
import {JPush} from "@jiguang-ionic/jpush";

declare let window;

@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {
    public isLogin = false;

    @LocalStorage
    private loginName: string;
    @LocalStorage
    private password: string;
    @LocalStorage
    private token: string;

    @LocalStorage
    private deviceNumber: string;//设备序列号

    @LocalStorage
    public isDebug;//YES NO
    @LocalStorage
    public debugUrl = "";
    public selectDebug: boolean;


    public userHtml = {
        loginName: '',
        htmlPwd: ''//存页面密码
    };
    public user = {
        loginName: '',
        password: '',//存加密密码
    };

    constructor(public navCtrl: NavController, public navParams: NavParams, public jpush: JPush,
                // public httpService: HttpService,
                public toastService: ToastService,
                public httpClient: HttpClientService, public modalCtrl: ModalController) {
        if (this.loginName) {
            this.userHtml.loginName = this.loginName;
        }
        if (this.password) {
            this.userHtml.htmlPwd = this.password;
        }

        if (this.isDebug == "YES") {
            this.selectDebug = true;
            if (!this.debugUrl) {
                this.debugUrl = "10.2.8.166:8118";
            }
        } else {
            this.selectDebug = false;
        }

    }

    ionViewWillEnter() {
        this.deleteAlias();
    }


    /**
     * 进入登陆页之前就清除别名，
     * 登陆之后重新注册
     */
    deleteAlias() {
        this.jpush.deleteAlias({sequence: Number(this.deviceNumber) ? Number(this.deviceNumber) : 1})
            .then((result) => {
            })
            .catch((error) => {
            });
    }

    /**
     * 注册别名
     */
    setAlias(userId) {
        this.jpush.setAlias({sequence: Number(this.deviceNumber) ? Number(this.deviceNumber) : 1, alias: '' + userId})
            .then((result) => {
            })
            .catch((error) => {
            });
    }

    public login(): void {

        if (this.checkReg()) {
            this.loginName = this.userHtml.loginName;//所有访问都需要带上loginName，就算是登录也需要
            this.user.loginName = this.userHtml.loginName;
            this.httpClient.httpClientPost('/doLogin.do', this.user, res => {
                this.isLogin = true;
                this.password = this.userHtml.htmlPwd;
                this.token = res.header.token;
                console.log("工程师ID" + res.body.userId)
                this.setAlias(res.body.userId);//注册别名
                this.toastService.toast('登录成功！', () => {
                })
            }, true);


        }

    }


    /**
     * 用户
     * @returns {boolean}
     */
    public checkReg(): boolean {
        // console.log('this.navCtrl.last().id', this.navCtrl.last().id);
        // console.log(this.navCtrl)
        // console.log(this.navCtrl.getViews()[0].id)
        // console.log(this.navCtrl.canGoBack())
        // if (!Const.telReg.test(this.user.tel)) {
        //   this.toastService.toast('请输入正确的手机号码！');
        //   return false;
        // }
        // if (!Const.pwdReg.test(this.user.htmlPwd)) {
        //   this.toastService.toast('请输入正确格式的密码！');
        //   return false;
        // }
        // return true;
        if (!this.userHtml.loginName) {
            this.toastService.toast('请输入账号！');
            return false;
        }
        if (!this.userHtml.htmlPwd) {
            this.toastService.toast('请输入密码！');
            return false;
        }
        return true;
    }

    ionViewDidLoad() {

    }


    public switchDebug() {
        if (this.selectDebug) {
            this.isDebug = "YES";
        } else {
            this.isDebug = "NO"
        }
    }


    public gotoPage(pageName): void {
        this.navCtrl.push(pageName);
        // let processModal = this.modalCtrl.create('QrScanerPage');
        // // processModal.onDidDismiss(data => {
        // //   console.log(data);
        // // });
        // processModal.present();
    }

}

