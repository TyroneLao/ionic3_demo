import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import {Observable} from "rxjs/Observable";
import { LocalStorage} from "../../../decorator/storage.decorator";

@Injectable()
export class RequestInterceptor implements HttpInterceptor {


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // console.log(req)
    // console.log(next)
    // console.log(next.handle(req))

    return next.handle(req);
  }
}
