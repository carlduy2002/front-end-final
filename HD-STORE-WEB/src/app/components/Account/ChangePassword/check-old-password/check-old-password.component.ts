import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/Services/api.service';
import ValidateForm from 'src/app/Helper/ValidateForm';
import { ToastrService } from 'ngx-toastr';
import { UserStoreService } from 'src/app/Services/user-store.service';

@Component({
  selector: 'app-check-old-password',
  templateUrl: './check-old-password.component.html',
  styleUrls: ['./check-old-password.component.css']
})
export class CheckOldPasswordComponent implements OnInit{
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  color:string = '#656b6f';
  password : string = '';
  fullname : string = '';
  role : string = "";
  account : any = [];
  account_password : string = '';
  user_id : number = 0;

  formOldPass !: FormGroup;

  constructor(
    private api : ApiService,
    private fb : FormBuilder,
    private route : Router,
    private toast : ToastrService,
    private userStore : UserStoreService
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

    this.formOldPass = this.fb.group({
      password: ['', Validators.required]
    });

    this.api.getUserByName(this.fullname).subscribe(data => {
      this.account = data;

      for(const account of this.account){
        this.account_password = account.account_password;
      }
    });

    this.api.getUserId(this.fullname).subscribe(data => {
      this.user_id = data;
    });
  }

  hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

  togglePasswordFields(){
    if(this.password != ''){
      this.color = 'white';
    }
    else{
      this.color = '#656b6f';
    }
  }

  ConfirmOldPassword(){
    if(this.formOldPass.valid){
      const password = this.formOldPass.get('password')?.value;
      this.api.confirmOldPassword(password, this.user_id).subscribe(res => {
        this.formOldPass.reset();

        this.route.navigate(['/change-password']);
      },
      error => {
        this.toast.error(error.error.message, 'Error', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-center'
        });
      });
    }
    else{
      ValidateForm.ValidateAllFormFileds(this.formOldPass);
      this.toast.warning("Please, enter the old password", 'Warning!', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center',
      });
    }
  }
}
