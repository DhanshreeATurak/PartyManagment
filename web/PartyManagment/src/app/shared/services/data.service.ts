import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpEvent, HttpContext, HttpEventType, HttpResponseBase } from "@angular/common/http";
import { from, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SecurityService } from './security.service';
//service
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

// declare var require;
// const Swal = require('sweetalert2');

// Implementing a Retry-Circuit breaker policy 
// is pending to do for the SPA app
@Injectable({
    providedIn: 'root'
})
export class DataService {
    constructor(
        private http: HttpClient,
        private securityService: SecurityService,
        private router: Router,
    ) { }

    get(url: string, isAuthTokenRequired: boolean = true, params?: any, isEnableLoader: boolean = true): Observable<Response> {
        return this.doGet(environment.baseUrl + url, isAuthTokenRequired, params, isEnableLoader);
    }

    post(url: string, data: any, isAuthTokenRequired: boolean = true, params?: any, isEnableLoader: boolean = true): Observable<Response> {
        return this.doPost(environment.baseUrl + url, data, isAuthTokenRequired, params, isEnableLoader);
    }

    postWithId(url: string, data: any, isAuthTokenRequired: boolean = true, params?: any, isEnableLoader: boolean = true): Observable<Response> {
        return this.doPost(environment.baseUrl + url, data, isAuthTokenRequired, params, isEnableLoader);
    }

    putWithId(url: string, data: any, isAuthTokenRequired: boolean = true, params?: any, isEnableLoader: boolean = true): Observable<Response> {
        return this.doPut(environment.baseUrl + url, data, isAuthTokenRequired, params, isEnableLoader);
    }

    upload(url: string, data: any, isAuthTokenRequired: boolean = true, params?: any, isEnableLoader: boolean = false): Observable<Response> {
        return this.doUpload(environment.baseUrl + url, data, isAuthTokenRequired, params, isEnableLoader);
    }

    delete(url: string, isAuthTokenRequired: boolean = true, params?: any, isEnableLoader: boolean = false): Observable<Response> {
        return this.doDelete(environment.baseUrl + url, isAuthTokenRequired, params, isEnableLoader);
    }

    
  private doUpload(url: string, data: any, isAuthTokenRequired: boolean = true, params?: any, isEnableLoader: boolean = false): Observable<Response> {
    let httpOptions = {
      headers: new HttpHeaders()
    };

    httpOptions = this.securityService.setUploadHeaders(isAuthTokenRequired, isEnableLoader);

    return this.http.post(url, data, httpOptions)
      .pipe(
        tap((res: any) => {
          return res;
        }),
        catchError((err: HttpErrorResponse) => this.handleError(err))
      );
  }


    private doGet(url: string, isAuthTokenRequired: boolean = true, params?: any, isEnableLoader: boolean = true): Observable<Response> {

        let httpOptions = {
            headers: new HttpHeaders()
        };

        httpOptions = this.securityService.setHeaders(isAuthTokenRequired);

        return this.http.get(url, httpOptions)
            .pipe(
                tap((res: any) => {
                    return res;
                }),
                catchError(err => this.handleError(err))
            );
    }

    private doPost(url: string, data: any, isAuthTokenRequired: boolean = true, params?: any, isEnableLoader: boolean = true): Observable<Response> {

        let httpOptions = {
            headers: new HttpHeaders()
        };

        httpOptions = this.securityService.setHeaders(isAuthTokenRequired);

        return this.http.post(url, data, httpOptions)
            .pipe(
                tap((res: any) => {
                    return res;
                }),
                catchError(err => this.handleError(err))
            );
    }

    private doDelete(url: string, isAuthTokenRequired: boolean = true, params?: any, isEnableLoader: boolean = true): Observable<Response> {

        let httpOptions = {
            headers: new HttpHeaders()
        };

        httpOptions = this.securityService.setHeaders(isAuthTokenRequired);

        return this.http.delete(url, httpOptions)
            .pipe(
                tap((res: any) => {
                    return res;
                }),
                catchError(err => this.handleError(err))
            );
    }

    private doPut(url: string, data: any, isAuthTokenRequired: boolean = true, params?: any, isEnableLoader: boolean = true): Observable<Response> {

        let httpOptions = {
            headers: new HttpHeaders()
        };

        httpOptions = this.securityService.setHeaders(isAuthTokenRequired);

        return this.http.put(url, data, httpOptions)
            .pipe(
                tap((res: any) => {
                    return res;
                }),
                catchError(err => this.handleError(err))
            );
    }

    private handleError(error: any) {
        if (error.error instanceof ErrorEvent) {
            
        }
        else if (error.status === 401) {
            this.router.navigate(['/login']);
        }
        return throwError(error || 'server error');
    }

}