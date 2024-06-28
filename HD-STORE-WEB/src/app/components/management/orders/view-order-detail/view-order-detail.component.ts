import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiOrderService } from 'src/app/Services/api-order.service';
import { ApiProductService } from 'src/app/Services/api-product.service';
import { ApiService } from 'src/app/Services/api.service';
import { UserStoreService } from 'src/app/Services/user-store.service';

@Component({
  selector: 'app-view-order-detail',
  templateUrl: './view-order-detail.component.html',
  styleUrls: ['./view-order-detail.component.css']
})
export class ViewOrderDetailComponent implements OnInit{
  public lstOrderDetail : any = [];
  orderId : number = 0;
  path : string = '';
  role : string = "";
  pageSize = 10;
  currentPage = 1;

  constructor(
    private apiOrder:ApiOrderService,
    private toast:ToastrService,
    private activatedRouter:ActivatedRoute,
    private apiProduct: ApiProductService,
    private userStore:UserStoreService,
    private api:ApiService
  ){}

  ngOnInit(): void {
    this.apiOrder.getLstOrder().subscribe(data => {
      this.lstOrderDetail = data;
      this.path = this.apiProduct.PhotoUrl + "/";
    });


    this.userStore.getRoleFromStore().subscribe(res => {
      let roleFromToken = this.api.getRoleFromToken();
      this.role = res || roleFromToken;
    });
  }
}
