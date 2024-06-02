import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup = new FormGroup({
    fullname: new FormControl(''),
    username: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
    acceptTerms: new FormControl(false),
  });
  submitted = false;
  accountLoginModel: any;
  constructor(private formBuilder: FormBuilder,public loginService: LoginService) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40),
          ],
        ],
      },
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.valid) {
      this.loginService.accountLogin(this.form.value).subscribe({
        next:(res)=>{
           if(res.isSuccess){
            // this.loginResponseModel = res?.response;
            // this.storageService.store('isAuthTokenRequired',res?.response?.token?.accessToken);
            // this.toaster.success(res?.message);
            // this.router.navigateByUrl('/dashboard');
           }else{
            // this.toaster.error(res?.errors);
           }
        },
        error:(err)=>{
          // this.toaster.error(err?.errors);
        }
      })
    }

    console.log(JSON.stringify(this.form.value, null, 2));
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }
}
