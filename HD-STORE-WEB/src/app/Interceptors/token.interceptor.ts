import { TokenApiModel } from './../Models/token-api.model';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';

import { Router } from '@angular/router';
import { ApiService } from '../Services/api.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private api:ApiService, private router:Router, private toast:ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const myToken = this.api.getToken();

    if(myToken){
      request = request.clone({
        setHeaders: {Authorization: `Bearer ${myToken}`}
      });
    }
    return next.handle(request).pipe(catchError((err:any) => {
      if(err instanceof HttpErrorResponse){
        if(err.status === 401){
          return this.handleUnauthorizedError(request, next);
        }
      }

      return throwError(() => new Error("Error in token.interceptor.ts"));
    }))
  }

  handleUnauthorizedError(req:HttpRequest<any>, next:HttpHandler){
    let tokenApiModel = new TokenApiModel();

    tokenApiModel.accessToken = this.api.getToken()!;
    tokenApiModel.refreshToken = this.api.getRefreshToken()!;

    return this.api.renewToken(tokenApiModel).pipe(
      switchMap((data:TokenApiModel) => {
        this.api.storeRefreshToken(data.refreshToken);
        this.api.storeToken(data.accessToken);

        req = req.clone({
          setHeaders: {Authorization: `Bearer ${data.accessToken}`}
        })

        return next.handle(req);
      }),
      catchError((error) => {
        return throwError(() => {
          this.toast.error("Token is expired, Login again!", 'Error!', {
            timeOut: 3000,
            progressBar: true,
            positionClass: 'toast-top-center',
          });
          this.router.navigate(['login']);
        })
      })
    )
  }
}
