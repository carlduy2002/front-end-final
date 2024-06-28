import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { param } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { ApiCartService } from 'src/app/Services/api-cart.service';
import { ApiOrderService } from 'src/app/Services/api-order.service';
import { ApiProductService } from 'src/app/Services/api-product.service';
import { ApiService } from 'src/app/Services/api.service';
import { UserStoreService } from 'src/app/Services/user-store.service';

@Component({
  selector: 'app-order-history-detail',
  templateUrl: './order-history-detail.component.html',
  styleUrls: ['./order-history-detail.component.css']
})
export class OrderHistoryDetailComponent implements OnInit{
  public lstOrderDetail : any = [];
  order_id : number = 0;
  path : string = "";
  fullname : string = "";
  role: string = "";
  cart_id : number = 0;

  pageSize = 10;
  currentPage = 1;

  constructor(
    private apiOrder:ApiOrderService,
    private apiProduct:ApiProductService,
    private userStore:UserStoreService,
    private api:ApiService,
    private toast:ToastrService,
    private apiCart:ApiCartService
  ){}

  ngOnInit(): void {
    this.userStore.getFullNameFromStore().subscribe(data => {
      let fullnameFromToken = this.api.getFullNameFormToken();
      this.fullname = data || fullnameFromToken;
      this.apiCart.getCartId(this.fullname).subscribe(data => {
        this.cart_id = data;
      });
    });

    this.userStore.getRoleFromStore().subscribe(res => {
      let roleFromToken = this.api.getRoleFromToken();
      this.role = res || roleFromToken;
    });

    this.apiOrder.getLstOrder().subscribe(data => {
      this.lstOrderDetail = data;
      this.path = this.apiProduct.PhotoUrl + "/";
      // console.log(this.lstOrderDetail);
      this.viewAllOrderHistoryDetail(this.lstOrderDetail);
    });
  }

  viewAllOrderHistoryDetail(id:number) {
    this.apiOrder.getOrderHistoryDetail(id).subscribe(data => {
      this.lstOrderDetail = data;
    });
  }

  getDataToView(product_image:any){
    this.apiProduct.getProductByImage(product_image).subscribe(data => {
      this.apiProduct.setLstProduct(data);
    });
  }

  ReOrder(qty:number, product_id:number){
    if(this.role === "Customer"){
      const obj = {
        cd_quantity : qty,
        cd_cart_id : this.cart_id,
        cd_product_id : product_id,
      }

      this.apiCart.addCart(obj).subscribe(res => {
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
      this.toast.warning("Just Customer Can Order!", 'Warning', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
      });
    }
  }
}
