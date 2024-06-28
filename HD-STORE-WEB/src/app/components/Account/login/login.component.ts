import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/Services/api.service';
import { ResetPasswordService } from 'src/app/Services/reset-password.service';
import { UserStoreService } from 'src/app/Services/user-store.service';
import validateForm from 'src/app/Helper/ValidateForm';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit{
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  loginForm!: FormGroup;
  show: string = "none";
  public resetPasswordEmail!: string;
  public isValidEmail!: boolean;
  color:string = '#656b6f';
  password : string = '';

  private broadcastChannel!: BroadcastChannel;

  checkAccount : string = "block";

  role : string = "";

  isValidUsername !: boolean;
  UsernameField !: string;

  isValidPassword !: boolean;
  PasswordField !: string;
  routerSubscription: any;

  disable : boolean = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router:Router,
    private userStore: UserStoreService,
    private resetPassword: ResetPasswordService,
    private toast:ToastrService
  ){this.broadcastChannel = new BroadcastChannel('auth_channel');}

  ngOnInit(): void {
    this.disable = false;
    this.loginForm = this.fb.group({
      username: ['', [Validators.pattern(/^\S+$/), Validators.required, Validators.min(5), Validators.max(20)]],
      password: ['', [Validators.required, Validators.min(8)]]
    });
  }

  hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

  togglePasswordFields(){
    if(this.PasswordField != ''){
      this.color = 'white';
    }
    else{
      this.color = '#656b6f';
    }
  }

  onLogin(){
    if(this.loginForm.valid){
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;

      this.api.login(username, password).subscribe(res => {
        this.loginForm.reset();
        this.api.storeToken(res.accessToken);

        this.api.storeRefreshToken(res.refreshToken);

        const tokenPayload = this.api.decodedToken();
        this.userStore.setFullNameForStore(tokenPayload.unique_name);
        this.userStore.setRoleForStore(tokenPayload.role);

        this.toast.success(res.message, 'Success', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-center',
        });

        this.userStore.getRoleFromStore().subscribe((res) => {
          let roleFromToken = this.api.getRoleFromToken();
          this.role = res || roleFromToken;
        });

        this.broadcastChannel.postMessage('reload');

        if(this.role === 'Admin'){
          this.router.navigate(['/admin']);
        }
        else{
          this.router.navigate(['']);
        }
      },
      error => {
        this.toast.error(error.error.message, 'Error!', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-center',
        });
      })
    }
    else{
      //throw the error using toaster and with required fields
      validateForm.ValidateAllFormFileds(this.loginForm);
      this.toast.warning("Please, enter all fields to login", 'Warning!', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center',
      });
    }
  }

  checkValidUsername(event:string){
    const value = event;
    const pattern = /^.{5,20}$/;
    this.isValidUsername = pattern.test(value);

    return this.isValidUsername;
  }

  checkValidPassword(event:string){
    const value = event;
    const pattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    this.isValidPassword = pattern.test(value);

    return this.isValidPassword;
  }

  checkValidEmail(event: string){
    const value = event;
    const pattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}/;
    this.isValidEmail = pattern.test(value);

    return this.isValidEmail;
  }


  confirmToSend(){
    if(this.checkValidEmail(this.resetPasswordEmail)){
      this.disable = true;
      // console.log(this.resetPasswordEmail);

      this.resetPassword.sendResetPasswordLink(this.resetPasswordEmail)
      .subscribe({
        next:(res)=>{
          this.toast.success(res.message, 'Success', {
            timeOut: 3000,
            progressBar: true,
            positionClass: 'toast-top-center',
          });
          this.resetPasswordEmail = "";
          const buttonRef = document.getElementById("btnClose");
          buttonRef?.click();
        },
        error:(err)=>{
          this.toast.error(err.error.message, 'Error!', {
            timeOut: 3000,
            progressBar: true,
            positionClass: 'toast-top-center',
          });alert(err.error.message);
        }
      });
    }
  }
}
