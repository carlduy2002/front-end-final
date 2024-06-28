import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiOrderService } from 'src/app/Services/api-order.service';
import { ApiService } from 'src/app/Services/api.service';
import { ShareService } from 'src/app/Services/share.service';
import { UserStoreService } from 'src/app/Services/user-store.service';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.css']
})
export class ViewOrderComponent implements OnInit{
  public lstOrder : any = [];
  searchTerm : string = '';

  fullname : string = "";
  role : string = "";
  cancelContent : string = "";
  orderId : number = 0;

  disable : boolean = false;

  pageSize = 10;
  currentPage = 1;

  currentDate: Date = new Date();

  constructor(
    private apiOrder:ApiOrderService,
    private toast:ToastrService,
    private userStore:UserStoreService,
    private api:ApiService
  ){}

  ngOnInit(): void {
    this.disable = false;
    this.userStore.getFullNameFromStore().subscribe(res => {
      let fullNameFromToken = this.api.getFullNameFormToken();
      this.fullname = res || fullNameFromToken;
    });


    this.userStore.getRoleFromStore().subscribe(res => {
      let roleFromToken = this.api.getRoleFromToken();
      this.role = res || roleFromToken;
    });

    this.viewAllOrder();
  }

  viewAllOrder(){
    this.apiOrder.getAllOrder().subscribe((data) => {
      this.lstOrder = data;
      for(const o of this.lstOrder){
        this.calculateFutureDate(o.order_date);
      }
    });
  }

  calculateFutureDate(dateString: string): Date {
    const orderDate = new Date(dateString);
    orderDate.setDate(orderDate.getDate() + 7);
    return orderDate;
  }

  toggleSearchButton(){
    if(this.searchTerm.trim() === ''){
      this.viewAllOrder();
    }
  }

  search(){
    this.apiOrder.search(this.searchTerm).subscribe(data => {
      this.lstOrder = data;
    },
    error => {
      this.toast.error(error.error.message, 'Error', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
      });
    });
  }

  confirmOrder(id:number){
    this.apiOrder.confirmOrder(id, this.fullname).subscribe(res => {
      this.toast.success(res.message, 'Success', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
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

  rejectOrder(id:number){
    this.apiOrder.rejectOrder(id, this.fullname).subscribe(res => {
      this.toast.success(res.message, 'Success', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
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

  returnOrder(id:number){
    this.apiOrder.returnOrder(id, this.fullname).subscribe(res => {
      this.toast.success(res.message, 'Success', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
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

  deliveredOrder(id:number){
    this.apiOrder.deliveredOrder(id, this.fullname).subscribe(res => {
      this.toast.success(res.message, 'Success', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
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

  getOrderID(id:number){
    this.orderId = id;
  }

  getDataToView(order_id:any){
    this.apiOrder.getOrderDetail(order_id).subscribe(data => {
      this.apiOrder.setLstOrder(data);
    });
  }

  Cancel(){
    this.disable = true;
    this.apiOrder.cancelOrderByAdmin(this.orderId, this.cancelContent, this.fullname).subscribe(res => {
      this.toast.success(res.message, 'Success', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
      });

      setTimeout(() => {
        window.location.reload();
      }, 3000);

      this.ngOnInit();
    });
  }
}
