import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { ToastrService } from 'ngx-toastr';
import ValidateForm from 'src/app/Helper/ValidateForm';
import { ApiOrderService } from 'src/app/Services/api-order.service';
import { ApiService } from 'src/app/Services/api.service';
import { UserStoreService } from 'src/app/Services/user-store.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit{
  public lstOrder : any = [];
  searchTerm : string = '';
  fullname : string = "";
  role: string = "";

  order_id : number = 0;

  orderForm!:FormGroup;

  pageSize = 10;
  currentPage = 1;

  @ViewChild('exampleModal') modal !: ElementRef;

  amount : number = 100;
  public payPalConfig?: IPayPalConfig;
  payment : boolean = false;

  isValidAddress !: boolean;
  isValidPhone !: boolean;
  disabled : boolean = true;

  AddressField : string = "";
  PhoneField : string = "";

  shippingType : string = '2';
  paymentMethod : string = 'Cash On Delivery';
  sum : number = 0;
  total : number = 0;



  constructor(
    private orderAPI : ApiOrderService,
    private userStore : UserStoreService,
    private api : ApiService,
    private toast:ToastrService,
    private fb:FormBuilder,
    private route:Router
  ){}

  ngOnInit(): void {
    this.userStore.getFullNameFromStore().subscribe(data => {
      let fullnameFromToken = this.api.getFullNameFormToken();
      this.fullname = data || fullnameFromToken;
      this.getOrderHistory(this.fullname);
    });

    this.disabled = true;

    this.userStore.getRoleFromStore().subscribe(res => {
      let roleFromToken = this.api.getRoleFromToken();
      this.role = res || roleFromToken;
    });

    this.orderForm = this.fb.group({
      order_id: ['', Validators.required],
      order_address: ['', Validators.required],
      order_phone: ['', [Validators.required, Validators.pattern(/^(03|05|09|07|08)[0-9]{8}$/), Validators.min(10)]],
      order_payment: ['Cash On Delivery', Validators.required],
      order_note: [''],
      order_total_price: ['']
    });
  }

  private initConfig(): void {
    this.payPalConfig = {
        currency: 'USD',
        clientId: 'AduwDY64LpXQEY5onFi2S4SGHnvAdTChELIuQai2vsh952vmchLMpVjCSwKrEsPUBLBHLSPi6Is216ec',
        createOrderOnClient: (data) => < ICreateOrderRequest > {
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: this.total.toString(),
                    breakdown: {
                        item_total: {
                            currency_code: 'USD',
                            value: this.sum.toString()
                        }
                    }
                },
                items: [{
                    name: 'Enterprise Subscription',
                    quantity: '1',
                    category: 'DIGITAL_GOODS',
                    unit_amount: {
                        currency_code: 'USD',
                        value: this.total.toString(),
                    },
                }]
            }]
        },
        advanced: {
            commit: 'true'
        },
        style: {
            label: 'paypal',
            layout: 'horizontal',
            shape: 'rect',
        },
        onApprove: (data, actions) => {
            // console.log('onApprove - transaction was approved, but not authorized', data, actions);
            actions.order.get().then((details: any) => {
                // console.log('onApprove - you can get full order details inside onApprove: ', details);
                if(details.status === 'COMPLETED'){
                  this.toast.success("Your Transaction is successfull. \n Your transaction id is: " + details.id + " \n Your product will be shipped soon", 'Success', {
                    timeOut: 3000,
                    progressBar: true,
                    positionClass: 'toast-top-center'
                  });
                }
            });

        },
        onClientAuthorization: (data) => {
            console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
            // this.showSuccess = true;
            if(data.status === 'COMPLETED'){
              // this.addOrder();

              this.toast.success("Your Transaction is successfull. \n Your transaction id is: " + data.id + " \n Your product will be shipped soon", 'Success', {
                timeOut: 3000,
                progressBar: true,
                positionClass: 'toast-top-center'
              });

              setTimeout(() => {
                window.location.reload();
              }, 3000);
            }
        },
        onCancel: (data, actions) => {
            console.log('OnCancel', data, actions);
            // this.showCancel = true;

        },
        onError: err => {
            console.log('OnError', err);
            // this.showError = true;
        },
        onClick: (data, actions) => {
            console.log('onClick', data, actions);
            // this.resetStatus();
        }
    };
  }

  getOrderHistory(username:string){
    this.orderAPI.getOrderHistory(username).subscribe(data => {
      this.lstOrder = data;
    });
  }

  getDataToView(order_id:any){
    this.orderAPI.setLstOrder(order_id);
  }

  toggleSearchButton(){
    if(this.searchTerm.trim() === ''){
    }
  }

  Cancel(order_id:number){
    this.orderAPI.cancelOrder(order_id).subscribe(res => {
      this.toast.success(res.message, 'Success', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
      });

      this.ngOnInit();
    });
  }

  onSelectPaymentMethod(event:any){
    this.paymentMethod = event.target.value;
    if(this.paymentMethod === 'Cash On Banking'){
      this.payment = true;
    }

    if(this.paymentMethod === 'Cash On Delivery'){
      this.payment = false;
    }

    this.ngOnInit();
  }

  onSelectShipType(event:any){
    this.shippingType = event.target.value;
    this.initConfig();
  }

  checkValidPhone(event: string){
    const value = event;
    const pattern = /^(03|05|09|07|08)[0-9]{8}$/;
    this.isValidPhone = pattern.test(value);
    this.PhoneField = event;

    return this.isValidPhone;
  }

  checkValidAddress(event:string){
    const value = event;
    const pattern = /^[a-zA-Z0-9]+$/;
    this.AddressField = event;

    this.isValidAddress = pattern.test(value);

    return this.isValidAddress;
  }

  // search(){
  //   // this.apiProduct.search(this.searchTerm).subscribe(data => {
  //   //   this.lstProduct = data;
  //   // },
  //   // error => {
  //   //   this.toast.error(error.error.message, 'Error', {
  //   //     timeOut: 3000,
  //   //     progressBar: true,
  //   //     positionClass: 'toast-top-center'
  //   //   });
  //   // })
  // }

}
