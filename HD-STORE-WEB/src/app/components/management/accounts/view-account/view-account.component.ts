import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/Services/api.service';
import { ShareService } from 'src/app/Services/share.service';
import { UserStoreService } from 'src/app/Services/user-store.service';

@Component({
  selector: 'app-view-account',
  templateUrl: './view-account.component.html',
  styleUrls: ['./view-account.component.css']
})
export class ViewAccountComponent implements OnInit{
  lstAccount : any = [];
  role : string = "";

  pageSize = 15;
  currentPage = 1;

  constructor(
    private api:ApiService,
    private toast:ToastrService,
    private shareService: ShareService,
    private userStore:UserStoreService
  ){}


  ngOnInit(): void {
    this.userStore.getRoleFromStore().subscribe(res => {
      let roleFromToken = this.api.getRoleFromToken();
      this.role = res || roleFromToken;
    });

    this.getAllAccount();
  }

  getAllAccount(){
    this.api.getAllAccount().subscribe(data => {
      this.lstAccount = data;
    })
  }

  callTest(): void {
    this.shareService.triggerLoad();
  }

  banAccount(id:any){
    this.api.banAccount(id).subscribe(res => {
      this.toast.success(res.message, 'Success', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
      });

      this.getAllAccount();
      this.callTest();
    },
    error => {
      this.toast.error(error.error.message, 'Error', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
      });
    })
  }

  unbanAccount(id:any){
    this.api.unbanAccount(id).subscribe(res => {
      this.toast.success(res.message, 'Success', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
      });

      this.getAllAccount();
    },
    error => {
      this.toast.error(error.error.message, 'Error', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
      });
    })
  }

}
