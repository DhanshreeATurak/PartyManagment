import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  private actionUrl: string | undefined;
    private headers: HttpHeaders;
    private storage: StorageService;
    private authenticationSource = new Subject<boolean>();
    authenticationChallenge$ = this.authenticationSource.asObservable();
    private authorityUrl = '';

    public IsAuthorized: boolean | undefined;
    public UserData: any;

    constructor(private _http: HttpClient, private _router: Router, private route: ActivatedRoute, private _storageService: StorageService) {
        this.headers = new HttpHeaders();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
        this.storage = _storageService;

        if (this.storage.retrieve('IsAuthorized') !== '') {
            this.IsAuthorized = this.storage.retrieve('IsAuthorized');
            this.authenticationSource.next(true);
            this.UserData = this.storage.retrieve('userData');
        }
    }

    

    public GetToken(): any {
        return this.storage.retrieve('authorizationDataIdToken');
    }

    public ResetAuthorizationData() {       
        this.storage.store('authorizationDataIdToken', '');
        this.IsAuthorized = false;
        this.storage.store('IsAuthorized', false);
    }

    public SetAuthorizationData(token: any, id_token: any) {
        if (this.storage.retrieve('authorizationDataIdToken') !== '') {
            this.storage.store('authorizationDataIdToken', '');
        }       
        this.storage.store('authorizationDataIdToken', id_token);
        this.IsAuthorized = true;
        this.storage.store('IsAuthorized', true);      
    }    

    public Logoff() {
        let authorizationUrl = this.authorityUrl + '/connect/endsession';
        let id_token_hint = this.storage.retrieve('authorizationDataIdToken');
        let post_logout_redirect_uri = location.origin + '/';

        let url =
            authorizationUrl + '?' +
            'id_token_hint=' + encodeURI(id_token_hint) + '&' +
            'post_logout_redirect_uri=' + encodeURI(post_logout_redirect_uri);

        this.ResetAuthorizationData();

        // emit observable
        this.authenticationSource.next(false);
        window.location.href = url;
    }

    public HandleError(error: any) {
        console.log(error);
        if (error.status == 403) {
            this._router.navigate(['/Forbidden']);
        }
        else if (error.status == 401) {
            // this.ResetAuthorizationData();
            this._router.navigate(['/Unauthorized']);
        }
    }

    private urlBase64Decode(str: string) {
        let output = str.replace('-', '+').replace('_', '/');
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw 'Illegal base64url string!';
        }

        return window.atob(output);
    }

    private getDataFromToken(token: any) {
        let data = {};

        if (typeof token !== 'undefined') {
            let encoded = token.split('.')[1];
            
            data = JSON.parse(this.urlBase64Decode(encoded));
        }

        return data;
    }
   
    public setHeaders(isAuthTokenRequired: boolean = true): any {
        const httpOptions = {
            headers: new HttpHeaders()
        };

        httpOptions.headers = httpOptions.headers.set('Content-Type', 'application/json');
        
        if(isAuthTokenRequired){
            const token = this.GetToken();
            if (token !== undefined && token !== '') {
                httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer '+ token);
            }
        }

        return httpOptions;
    }
    
  public setUploadHeaders(isAuthTokenRequired: boolean = true, isEnableLoader: boolean = false): any {
    const httpOptions = {
      headers: new HttpHeaders()
    };

    httpOptions.headers = httpOptions.headers.delete('Content-Type', 'application/json');
    httpOptions.headers = httpOptions.headers.delete('Accept-Encoding', 'application/json');
    //httpOptions.headers = httpOptions.headers.set('Accept', 'application/json');
    httpOptions.headers = httpOptions.headers.set('cache-control', 'no-cache');
    
    if (!isEnableLoader) {
      httpOptions.headers = httpOptions.headers.set('ignoreLoadingBar', '');
    }

    if (isAuthTokenRequired) {
      const token = this.GetToken();
      if (token !== undefined && token !== '') {
        httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
      }
    }

    return httpOptions;
  }
}
