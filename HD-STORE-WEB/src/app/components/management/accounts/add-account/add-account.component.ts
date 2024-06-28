import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/Services/api.service';
import ValidateForm from 'src/app/Helper/ValidateForm';
import { RoleService } from 'src/app/Services/role.service';
import { UserStoreService } from 'src/app/Services/user-store.service';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.css']
})
export class AddAccountComponent implements OnInit{
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  registerForm!: FormGroup

  lstRole : any = [];
  role : string = "";

  isValidEmail !: boolean;
  isValidPhone !: boolean;
  isValidPassword !: boolean;
  isValidConfirmPassword !: boolean;
  isValidUsername !: boolean;

  EmailField !: string;
  PhoneField !: string;
  PasswordField !: string;
  ConfirmPasswordField !: string;
  UsernameField !: string;

  constructor(
    private api:ApiService,
    private fb:FormBuilder,
    private router:Router,
    private toast:ToastrService,
    private roleApi : RoleService,
    private userStore:UserStoreService
  ){}

  ngOnInit(): void {
    this.userStore.getRoleFromStore().subscribe(res => {
      let roleFromToken = this.api.getRoleFromToken();
      this.role = res || roleFromToken;
    });

    this.getRole();

    this.registerForm = this.fb.group({
      username: ['', [Validators.pattern(/^\S+$/), Validators.required, Validators.min(5), Validators.max(20)]],
      email: ['', Validators.required, Validators.pattern(/^\S+$/)],
      password: ['', [Validators.required, Validators.min(8), Validators.pattern(/^\S+$/)]],
      confirmPassword: ['', [Validators.required, Validators.min(8), Validators.pattern(/^\S+$/)]],
      birthday: ['', Validators.required],
      gender: ['', Validators.required],
      phone: ['', [Validators.required, Validators.min(10), Validators.pattern(/^\S+$/)]],
      address: [''],
      role: [0, Validators.required]
    })
  }

  getRole() {
    this.roleApi.getAllRoles().subscribe(data => {
      this.lstRole = data;
    });
  }

  checkValidEmail(event: string){
    const value = event;
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w]{2,3}$/;
    this.isValidEmail = pattern.test(value);

    return this.isValidEmail;
  }

  checkValidPhone(event: string){
    const value = event;
    const pattern = /^(03|05|09|07|08)[0-9]{8}$/;
    this.isValidPhone = pattern.test(value);

    return this.isValidPhone;
  }

  checkValidPassword(event:string){
    const value = event;
    const pattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    this.isValidPassword = pattern.test(value);

    return this.isValidPassword;
  }

  checkValidConfirmPassword(event:string){
    const value = event;
    const pattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    this.isValidConfirmPassword = pattern.test(value);

    return this.isValidConfirmPassword;
  }

  checkValidUsername(event:string){
    const value = event;
    const pattern = /^.{5,20}$/;
    this.isValidUsername = pattern.test(value);

    return this.isValidUsername;
  }

  onSignup(){
    console.log(this.registerForm.value);
    if(this.registerForm.valid){
      this.api.signup(this.registerForm.value).subscribe(res => {
        this.toast.success(res.message, 'Success', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-center',
        });
        this.registerForm.reset();
        this.router.navigate(['/view-account']);
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
      ValidateForm.ValidateAllFormFileds(this.registerForm);
      this.toast.warning("Please, enter the required fields to register", 'Warning!', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center',
      })
    }
  }

  hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

}
