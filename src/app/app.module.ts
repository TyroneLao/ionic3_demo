import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {FileTransfer, FileUploadOptions, FileTransferObject} from '@ionic-native/file-transfer';
import {File} from '@ionic-native/file';
import {MyApp} from './app.component';
import {Device} from "@ionic-native/device";
import {AppVersion} from "@ionic-native/app-version";
import {AndroidBackService} from "../services/androidbackservice/androidback.service";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {HttpClientService} from "../services/httpclientservice/httpclient.service";
import {RequestInterceptor} from "../services/httpclientservice/interceptor/request.interceptor";
import {ToastService} from "../services/toastservice/toast.service";
import {AlertService} from "../services/alertservice/alert.service";
import {LoadingService} from "../services/loadingservice/loading.service";
import {ResponseInterceptor} from "../services/httpclientservice/interceptor/response.interceptor";
import {UtilService} from "../services/utilservice/util.service";
import {FileOpener} from "@ionic-native/file-opener";
import {Toast} from "@ionic-native/toast";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {Network} from "@ionic-native/network";
import {NativeService} from "../services/nativeservice/native.service";
import {DatePipe} from "@angular/common";
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import { JPush } from '@jiguang-ionic/jpush';
import {Diagnostic} from "@ionic-native/diagnostic";

@NgModule({
    declarations: [
        MyApp,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        IonicModule.forRoot(MyApp, {
            // preloadModules: true,
            mode: 'ios',//会导致QRScanner 相机画面展示不了
            backButtonText: '',
        })
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
    ],
    providers: [
        Device,
        FileOpener,
        AppVersion,
        StatusBar,
        SplashScreen,
        IonicApp,
        DatePipe,
        Toast,
        File,
        FileTransfer,
        InAppBrowser,
        Network,
        StatusBar,
        SplashScreen,
        ScreenOrientation,
        NativeService,
        JPush,
        Diagnostic,

        UtilService,
        AndroidBackService,
        HttpClientService,
        ToastService,
        AlertService,
        LoadingService,

        StatusBar,
        SplashScreen,
        {provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true,},
        {provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true,},
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {
}
