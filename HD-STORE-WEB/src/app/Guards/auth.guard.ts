import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ApiService } from '../Services/api.service';
import { ToastrService } from 'ngx-toastr';
import { UserStoreService } from '../Services/user-store.service';

@Injectable({
  providedIn: 'root'
})

export class authGuard implements CanActivate{
  adminRole:string = '';
  lstAccount:any=[];

  constructor(
    private api:ApiService,
    private router:Router,
    private toast:ToastrService,
    private userStore: UserStoreService
  ){}

  canActivate():boolean{
    this.userStore.getRoleFromStore().subscribe(data =>{
      let roleFromToken = this.api.getRoleFromToken();
      this.adminRole = data || roleFromToken;
    });

    this.api.getAllAccount().subscribe(data => {
      this.lstAccount = data;
    });

    if(this.api.isLoggedIn()){
      if(this.adminRole == "Admin" || this.adminRole == 'Manager'){
        return true;
      }
      else{
        this.toast.warning("Just Admin and Manager can access!", 'Warning!', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-center',
        })
        this.router.navigate(['']);
        return false;
      }
    }
    else{
      this.toast.warning("Please login first", 'Warning!', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center',
      })
      this.router.navigate(['login']);
      return false;
    }
  }
  // && this.adminRole == "Admin" || this.adminRole == 'Manager' || this.adminRole == 'Customer'
}
