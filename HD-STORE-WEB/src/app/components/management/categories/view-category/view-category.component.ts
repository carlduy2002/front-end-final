import { Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiCategoryService } from 'src/app/Services/api-category.service';
import { ApiService } from 'src/app/Services/api.service';
import { ShareService } from 'src/app/Services/share.service';
import { UserStoreService } from 'src/app/Services/user-store.service';

@Component({
  selector: 'app-view-category',
  templateUrl: './view-category.component.html',
  styleUrls: ['./view-category.component.css']
})
export class ViewCategoryComponent implements OnInit{
  public lstCategory : any = [];
  searchTerm: string = '';
  role : string = "";
  fullname : string = "";
  categoryId : number = 0;

  pageSize = 10;
  currentPage = 1;

  constructor(
    private apiCategory:ApiCategoryService,
    private toast:ToastrService,
    private shareService:ShareService,
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

    this.viewAllCategory();
  }

  viewAllCategory(){
    this.apiCategory.getAllCategory().subscribe((data) => {
      this.lstCategory = data;
    })
  }

  callTest(): void {
    this.shareService.triggerLoad();
  }

  getCategory(id:number){
    this.categoryId = id;
  }

  getCategoryToUpdate(category_id:any){
    this.apiCategory.getCategoryById(category_id).subscribe(data => {
      this.apiCategory.setLstCategory(data);
    });
  }

  search(){
    if(this.searchTerm != ''){
      this.apiCategory.search(this.searchTerm).subscribe(data => {
        this.lstCategory = data;
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
      this.viewAllCategory();
    }
  }

  toggleSearchButton(): void {
    if (this.searchTerm.trim() === '') {
      this.viewAllCategory();
    }
  }

  deleteCategory(){
    if(this.role === 'Admin'){
      this.apiCategory.deleteCategory(this.categoryId).subscribe(res => {
        this.toast.success(res.message, 'Success', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-center',
        });

        this.callTest();
        this.viewAllCategory();
      },
      error => {
        this.toast.error(error.error.message, 'Error!', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-center',
        });
      });
    }
    else{
      const formData = new FormData();
      formData.append('adder', this.fullname);
      formData.append('category_id', this.categoryId.toString());

      this.apiCategory.deleteCategoryByManager(formData).subscribe(res => {
        this.toast.success(res.message, 'Success', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-center',
        });

        this.callTest();
        this.viewAllCategory();
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


  confirmCategory(id:any){
    this.apiCategory.confirmCategory(id).subscribe(res => {
      this.toast.success(res.message, 'Success', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toat-top-center'
      });

      this.ngOnInit();
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
