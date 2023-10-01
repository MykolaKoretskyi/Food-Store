import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {TokenStorage} from "../services/auth/token-storage";
const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {


  constructor(private tokenStorage: TokenStorage) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const accessToken:string | null = this.tokenStorage.getAccessToken();

    request = request.clone({headers: request.headers.set(TOKEN_HEADER_KEY,
        "" + accessToken)});

    return next.handle(request);
  }


}
