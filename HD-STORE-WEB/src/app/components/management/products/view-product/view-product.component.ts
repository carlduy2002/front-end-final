import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiProductService } from 'src/app/Services/api-product.service';
import { ApiService } from 'src/app/Services/api.service';
import { UserStoreService } from 'src/app/Services/user-store.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit{
  public lstProduct:any = [];
  path:any;
  searchTerm : string = '';
  role : string = "";
  fullname : string = "";
  productId : number = 0;

  pageSize = 8;
  currentPage = 1;

  constructor(
    private apiProduct:ApiProductService,
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

   this.viewAllProduct();
  }

  viewAllProduct(){
    if(this.role === 'Admin'){
      this.apiProduct.getAllProduct().subscribe(data => {
        this.lstProduct = data;
        this.path = this.apiProduct.PhotoUrl + "/";
      });
    }
    else{
      this.apiProduct.getAllProductByManager().subscribe(data => {
        this.lstProduct = data;
        this.path = this.apiProduct.PhotoUrl + "/";
      });
    }
  }

  toggleSearchButton(){
    if(this.searchTerm.trim() === ''){
      this.viewAllProduct();
    }
  }

  getProduct(id:number){
    this.productId = id;
  }

  getDataToUpdate(product_id:any){
    this.apiProduct.getProductById(product_id).subscribe(data => {
      this.apiProduct.setLstProduct(data);
    });
  }

  search(){
    this.apiProduct.search(this.searchTerm).subscribe(data => {
      this.lstProduct = data;
    },
    error => {
      this.toast.error(error.error.message, 'Error', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
      });
    })
  }

  deleteProduct(){
    if(this.role === "Admin"){
      this.apiProduct.deleteProduct(this.productId).subscribe(data => {
        this.toast.success(data.message, 'Success', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-center',
        });

        this.viewAllProduct();
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
      formData.append('deleter', this.fullname);
      formData.append('id', this.productId.toString());

      this.apiProduct.deleteProductByManager(formData).subscribe(data => {
        this.toast.success(data.message, 'Success', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-center',
        });

        this.viewAllProduct();
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

  confirmProduct(id:any){
    this.apiProduct.confirmProduct(id).subscribe(res => {
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
