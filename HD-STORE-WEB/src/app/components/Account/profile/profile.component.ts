import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, HostBinding, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import ValidateForm from 'src/app/Helper/ValidateForm';
import { ApiCategoryService } from 'src/app/Services/api-category.service';
import { ApiService } from 'src/app/Services/api.service';
import { ShareService } from 'src/app/Services/share.service';
import { UserStoreService } from 'src/app/Services/user-store.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  animations: [
    trigger('zoom', [
      state('normal', style({ transform: 'scale(1)' })),
      state('zoomed', style({ transform: 'scale(1.5)' })),
      transition('normal <=> zoomed', animate('0.3s ease-in-out')),
    ]),
  ],
})
export class ProfileComponent implements OnInit{
  public fullname:string = "";
  public role:string = "";
  public account: any = [];

  a_birthday : string = '';
  profileForm !: FormGroup;
  path : any;
  image : any;
  uri:string = '';
  file!: File;
  showImage : boolean = false;
  hideImage : boolean = true;

  Avatar : string = "";

  @HostBinding('@zoom') get zoomState() { return this.zoomed ? 'zoomed' : 'normal'; }
  zoomed : boolean = false;


  isValidEmail !: boolean;
  isValidPhone !: boolean;
  isValidUsername !: boolean;

  EmailField !: string;
  PhoneField !: string;
  UsernameField !: string;

  constructor(
    private api:ApiService,
    private userStore:UserStoreService,
    private route:Router,
    private toast:ToastrService,
    private fb:FormBuilder
  ){}

  ngOnInit(): void {
    this.userStore.getFullNameFromStore().subscribe(res => {
      let fullNameFromToken = this.api.getFullNameFormToken();
      this.fullname = res || fullNameFromToken;
      this.getaccount(this.fullname);
      this.path = this.api.PhotoUrl + "/";
    });

    this.profileForm = this.fb.group({
      id : ['', Validators.required],
      username : ['', [Validators.pattern(/^.{5,20}$/), Validators.required, Validators.min(5), Validators.max(20)]],
      email: ['', [Validators.pattern(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}/), Validators.required]],
      address: ['', Validators.required],
      phone: ['', [Validators.pattern(/^(03|05|09|07|08)[0-9]{8}$/), Validators.required, Validators.min(10)]],
      gender: ['', Validators.required],
    });

    this.userStore.getRoleFromStore().subscribe(res => {
      let roleFromToken = this.api.getRoleFromToken();
      this.role = res || roleFromToken;
    });

    this.userStore.setRoleForStore(this.role);
  }

  getaccount(user:string){
    this.api.getUserByName(user).subscribe(data => {
      this.account = data;

      for(const data of this.account){
        this.profileForm.patchValue({
          id : data.account_id,
          username : data.account_username,
          email : data.account_email,
          address : data.account_address,
          phone : data.account_phone,
          gender: data.account_gender,
        });

        this.a_birthday = data.account_birthday;
        this.Avatar = data.account_avatar;
        // console.log(this.Avatar);
      }
    });
  }

  birthdayChange(event:any){
    this.a_birthday = event.target.value;
  }

  uploadImage(event:any){
    this.file = event.target.files[0];

    // if(file && file.length > 0){
    //   this.showImage = true;
    //   this.hideImage = false;

    //   this.file = event.target.files[0];
    // }
  }

  saveChange(){
    if(this.profileForm.valid){
      const formData:FormData = new FormData();
      if(this.file == undefined){
        const pattern = /^\S+$/;
        if(pattern.test(this.profileForm.get('username')?.value)){
          formData.append('id', this.profileForm.get('id')?.value);
          formData.append('username', this.profileForm.get('username')?.value);
          formData.append('email', this.profileForm.get('email')?.value);
          formData.append('address', this.profileForm.get('address')?.value);
          formData.append('phone', this.profileForm.get('phone')?.value);
          formData.append('birthday', this.a_birthday);
          formData.append('gender', this.profileForm.get('gender')?.value);

          this.api.updateProfile(formData).subscribe(res => {
            this.api.storeToken(res.accessToken);
            this.api.storeRefreshToken(res.refreshToken);

            const tokenPayload = this.api.decodedToken();
            this.userStore.setFullNameForStore(tokenPayload.unique_name);
            this.userStore.setRoleForStore(tokenPayload.role);

            // console.log('accesstoken:', res.accessToken);

            this.ngOnInit();
            // window.location.reload();

            this.toast.success(res.message, 'Success', {
              timeOut: 3000,
              progressBar: true,
              positionClass: 'toast-top-center'
            });
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
          this.toast.error("Username don't allow the space", 'Error', {
            timeOut: 3000,
            progressBar: true,
            positionClass: 'toast-top-center'
          });
        }
      }
      else{
        formData.append('uploadFile', this.file, this.file.name);
        formData.append('id', this.profileForm.get('id')?.value);
        formData.append('username', this.profileForm.get('username')?.value);
        formData.append('email', this.profileForm.get('email')?.value);
        formData.append('address', this.profileForm.get('address')?.value);
        formData.append('phone', this.profileForm.get('phone')?.value);
        formData.append('birthday', this.a_birthday);
        formData.append('gender', this.profileForm.get('gender')?.value);

        this.api.updateProfile(formData).subscribe(res => {
          this.api.storeToken(res.accessToken);
          this.api.storeRefreshToken(res.refreshToken);

          const tokenPayload = this.api.decodedToken();
          this.userStore.setFullNameForStore(tokenPayload.unique_name);
          this.userStore.setRoleForStore(tokenPayload.role);

          this.ngOnInit();
          //

          this.toast.success(res.message, 'Success', {
            timeOut: 3000,
            progressBar: true,
            positionClass: 'toast-top-center'
          });
        },
        error => {
          this.toast.error(error.error.message, 'Error', {
            timeOut: 3000,
            progressBar: true,
            positionClass: 'toast-top-center'
          });
        });
      }
    }
    else{
      ValidateForm.ValidateAllFormFileds(this.profileForm);
      this.toast.error("Profile information is invalid", 'Error', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
      });
    }
  }
}
