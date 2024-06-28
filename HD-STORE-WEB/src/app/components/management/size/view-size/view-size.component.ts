import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/Services/api.service';
import { SizeService } from 'src/app/Services/size.service';
import { UserStoreService } from 'src/app/Services/user-store.service';

@Component({
  selector: 'app-view-size',
  templateUrl: './view-size.component.html',
  styleUrls: ['./view-size.component.css']
})
export class ViewSizeComponent implements OnInit{
  public lstSize:any = [];
  role : string = "";
  fullname : string = "";
  sizeId : number = 0;

  pageSize = 10;
  currentPage = 1;

  constructor(
    private sizeApi:SizeService,
    private toast:ToastrService,
    private router:Router,
    private userStore:UserStoreService,
    private api:ApiService
  ){}

  ngOnInit(): void {
    this.userStore.getRoleFromStore().subscribe(res => {
      let roleFromToken = this.api.getRoleFromToken();
      this.role = res || roleFromToken;
    });

    this.userStore.getFullNameFromStore().subscribe(res => {
      let fullNameFromToken = this.api.getFullNameFormToken();
      this.fullname = res || fullNameFromToken;
    });

    this.viewAllSize();
  }

  viewAllSize(){
    this.sizeApi.getAllSizes().subscribe(data => {
      this.lstSize = data.sort((a: { size_number: number; }, b: { size_number: number; }) => a.size_number - b.size_number);
    });
  }

  getSize(id:any){
    this.sizeId = id;
  }

  getDataToUpdate(size_id:any){
    this.sizeApi.getSizeById(size_id).subscribe(data => {
      this.sizeApi.setLstSize(data);
    });
  }

  deleteSize(){
    this.sizeApi.deleteSize(this.sizeId).subscribe(data => {
      this.toast.success(data.message, 'Success', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center',
      });

      this.viewAllSize();
    },
    error => {
      this.toast.error(error.error.message, 'Error!', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center',
      });
    });
  }

}
