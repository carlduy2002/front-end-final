import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { confirmPasswordValidator } from 'src/app/Helper/confirm-password.validator';
import { ResetPassword } from 'src/app/Models/reset-password.model';
import { ResetPasswordService } from 'src/app/Services/reset-password.service';
import ValidateForm from 'src/app/Helper/ValidateForm';
import { UserStoreService } from 'src/app/Services/user-store.service';
import { ApiService } from 'src/app/Services/api.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit{
  emailToReset!:string;
  emailToken!:string;
  resetPasswordObj = new ResetPassword();

  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  colorNewPass:string = '#656b6f';
  colorConfirmPass:string = '#656b6f';
  new_password : string = '';
  confirm_password : string = '';

  resetPasswordForm !: FormGroup

  isValidPassword !: boolean;
  isValidConfirmPassword !: boolean;

  constructor(
    private api : ApiService,
    private toast : ToastrService,
    private router : Router,
    private userStore : UserStoreService,
    private fb : FormBuilder,
    private activatedRoute:ActivatedRoute,
    private resetPasswordService : ResetPasswordService
  ){}

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      new_password: ['', [Validators.required, Validators.min(8)]],
      confirm_password: ['', [Validators.required, Validators.min(8)]]
    });

    this.activatedRoute.queryParams.subscribe(val => {
      this.emailToReset = val['email'];
      let uriToken = val['code'];
      this.emailToken = uriToken.replace(/ /g, '+');
    });
  }

  hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

  toggleNewPasswordFields(){
    if(this.new_password != ''){
      this.colorNewPass = 'white';
    }
    else{
      this.colorNewPass = '#656b6f';
    }
  }

  toggleConfirmPasswordFields(){
    if(this.confirm_password != ''){
      this.colorConfirmPass = 'white';
    }
    else{
      this.colorConfirmPass = '#656b6f';
    }
  }

  checkValidPassword(event:any){
    const value = event;
    const pattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    this.isValidPassword = pattern.test(value);

    return this.isValidPassword;
  }

  checkValidConfirmPassword(event:any){
    const value = event;
    const pattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    this.isValidConfirmPassword = pattern.test(value);

    return this.isValidConfirmPassword;
  }


  reset(){
    if(this.resetPasswordForm.valid){
      this.resetPasswordObj.email = this.emailToReset;
      this.resetPasswordObj.newPassword = this.resetPasswordForm.value.new_password;
      this.resetPasswordObj.confirmPassword = this.resetPasswordForm.value.confirm_password;
      this.resetPasswordObj.emailToken = this.emailToken;

      this.resetPasswordService.resetPassword(this.resetPasswordObj)
      .subscribe({
        next:(res)=>{
          this.toast.success(res.message, 'Success', {
            timeOut: 3000,
            progressBar: true,
            positionClass: 'toast-top-center',
          });
          this.router.navigate(['login']);
        },
        error:(err)=>{
          this.toast.error(err.error.message, 'Error!', {
            timeOut: 3000,
            progressBar: true,
            positionClass: 'toast-top-center',
          });
        }
      })
    }
    else{
      ValidateForm.ValidateAllFormFileds(this.resetPasswordForm);
      this.toast.warning("Please, enter all fields to renew password", 'Warning!', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center',
      })
    }
  }
}
