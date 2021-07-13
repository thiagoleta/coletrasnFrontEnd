import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { AuthHelper } from '../_helpers/auth.helper';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(private authHelper: AuthHelper) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (!request.url.includes("/api/login")) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${this.authHelper.getAccessToken()}`
                }
            })
        }

        return next.handle(request);
    }
}

