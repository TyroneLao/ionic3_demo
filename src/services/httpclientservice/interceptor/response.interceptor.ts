import 'rxjs/add/operator/do';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {ToastController} from "ionic-angular";
import {LocalStorage} from "../../../decorator/storage.decorator";

export class ResponseInterceptor implements HttpInterceptor {
  @LocalStorage
  private token:string;

  constructor() {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const started = Date.now();
    // console.log('开始访问啦'+started);
    // console.log('next',next)
    return next
      .handle(req)
      .do(event => {
        if (event instanceof HttpResponse) {
          // console.log(event)
          if(event.body.resp&&event.body.resp.header&&event.body.resp.header.token){
            // console.log(event.body.resp.header.token)
            this.token=event.body.resp.header.token;
          }else {
            this.token='';
          }

          // switch (event.status) {
          //   case 200:
          //     if (event.body['header']) {
          //       let newEvent = event.clone({body: event.body['data']});
          //       return newEvent;
          //     } else {
          //       throw event.body['msg'];
          //     }
          //   case 401:
          //     // this.storage.remove('auth_token');
          //     // this.router.navigate(['/login']);
          //   default:
          //     throw `【${event.status}】【${event.statusText}】`;
          // }
        }
        // return event;
      });
  }

}
