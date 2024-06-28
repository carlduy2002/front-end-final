import { Subject } from 'rxjs';
import { state } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import ValidateForm from 'src/app/Helper/ValidateForm';
import { ApiService } from 'src/app/Services/api.service';
import { UserStoreService } from 'src/app/Services/user-store.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit{
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  colorNewPass:string = '#656b6f';
  colorConfirmPass:string = '#656b6f';
  new_password : string = '';
  confirm_password : string = '';

  fullname : string = '';
  role : string = "";
  user_id : number = 0;

  formChangePassword !: FormGroup

  isValidPassword !: boolean;
  isValidConfirmPassword !: boolean;

  constructor(
    private api : ApiService,
    private toast : ToastrService,
    private route : Router,
    private userStore : UserStoreService,
    private fb : FormBuilder
  ){}

  ngOnInit(): void {
    this.userStore.getFullNameFromStore().subscribe(res => {
      let fullNameFromToken = this.api.getFullNameFormToken();
      this.fullname = res || fullNameFromToken;
    });

    this.userStore.getRoleFromStore().subscribe(res => {
      let roleFromToken = this.api.getRoleFromToken();
      this.role = res || roleFromToken;
    });

    this.formChangePassword = this.fb.group({
      new_password: ['', [Validators.required, Validators.min(8)]],
      confirm_password: ['', [Validators.required, Validators.min(8)]]
    })

    this.api.getUserId(this.fullname).subscribe(data => {
      this.user_id = data;
    })
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

  ChangePassword(){
    if(this.formChangePassword.valid){
      const new_password = this.formChangePassword.get('new_password')?.value;
      const confirm_password = this.formChangePassword.get('confirm_password')?.value;

      this.api.changePassword(new_password, confirm_password, this.user_id).subscribe(res => {
        this.toast.success(res.message, 'Success', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-center'
        });

        if(this.role === 'Manager' || this.role  === 'Customer'){
          this.route.navigate(['/']);
        }
        else{
          this.route.navigate(['/profile']);
        }
      },
      error => {
        this.toast.error(error.error.message, 'Error', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-center'
        });
      })
    }
    else{
      ValidateForm.ValidateAllFormFileds(this.formChangePassword);
      this.toast.warning("Please, enter the all fields to change password", 'Warning!', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center',
      });
    }
  }


}
