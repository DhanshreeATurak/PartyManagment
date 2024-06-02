import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { DataService } from 'src/app/shared/services/data.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(public service: DataService) { }
  
  accountLogin(data:any){
    let url = "api/App/Account/signIn";
    let Json = JSON.stringify(data);
    console.log(url,Json)
    let formData: FormData = new FormData(); 
    formData.append('username', data.username); 
    formData.append('password', data.password); 
    return this.service.post(url,formData).pipe<any>(tap((response: any) => {
        return response;
    })
    );  
  }
}
