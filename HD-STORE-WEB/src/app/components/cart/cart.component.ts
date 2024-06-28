import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import ValidateForm from 'src/app/Helper/ValidateForm';
import { ApiCartService } from 'src/app/Services/api-cart.service';
import { ApiOrderService } from 'src/app/Services/api-order.service';
import { ApiProductService } from 'src/app/Services/api-product.service';
import { ApiService } from 'src/app/Services/api.service';
import { UserStoreService } from 'src/app/Services/user-store.service';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TimeScale } from 'chart.js';
import { ConnectionPositionPair } from '@angular/cdk/overlay';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit{
  public lstCart : any = [];
  public lstCartOrder : any = [];
  fullname:string = '';
  role : string = "";
  cartID:number = 0;
  total:number = 0;
  tempTotal:number = 0;
  path:string = '';
  qtyCart = 0;
  protQty = 1;
  shippingType : string = '5';
  paymentMethod : string = 'Cash On Delivery';
  sum : number = 0;

  show : string = '#exampleModal';
  disabled : boolean = true;

  orderForm!:FormGroup;

  @ViewChild('exampleModal') modal !: ElementRef;

  amount : number = 100;
  public payPalConfig?: IPayPalConfig;
  payment : boolean = false;

  isValidAddress !: boolean;
  isValidPhone !: boolean;

  AddressField : string = "";
  PhoneField : string = "";

  inputValue: string = '';

  private broadcastChannel!: BroadcastChannel;

  constructor(
    private userStore:UserStoreService,
    private api:ApiService,
    private apiCart:ApiCartService,
    private apiProduct:ApiProductService,
    private toast:ToastrService,
    private fb:FormBuilder,
    private apiOrder: ApiOrderService,
  ){this.broadcastChannel = new BroadcastChannel('auth_channel');}


  ngOnInit(): void {
    this.disabled = true;

    this.userStore.getFullNameFromStore().subscribe(res => {
      let fullNameFromToken = this.api.getFullNameFormToken();
      this.fullname = res || fullNameFromToken;
    });

    this.userStore.getRoleFromStore().subscribe(res => {
      let roleFromToken = this.api.getRoleFromToken();
      this.role = res || roleFromToken;
    });

    this.apiCart.getCartId(this.fullname).subscribe(data => {
      this.cartID = data;
      // console.log(this.cartID);
      this.getCart(this.cartID);
      this.path = this.apiProduct.PhotoUrl + "/";
    });

    this.orderForm = this.fb.group({
      order_address: ['', Validators.required],
      order_phone: ['', [Validators.required, Validators.pattern(/^(03|05|09|07|08)[0-9]{8}$/), Validators.min(10)]],
      order_payment: ['Cash On Delivery', Validators.required],
      order_note: [''],
      order_total_price: ['']
    });

    this.initConfig();
  }

  private initConfig(): void {
    this.sum = (this.total + parseInt(this.shippingType));
    this.payPalConfig = {
        currency: 'USD',
        clientId: 'AduwDY64LpXQEY5onFi2S4SGHnvAdTChELIuQai2vsh952vmchLMpVjCSwKrEsPUBLBHLSPi6Is216ec',
        createOrderOnClient: (data) => < ICreateOrderRequest > {
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: this.sum.toString(),
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
                        value: this.sum.toString(),
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
                // this.orderForm.reset();
                // if(details.status === 'COMPLETED'){
                //   this.toast.success("Your Transaction is successfull. \n Your transaction id is: " + details.id + " \n Your product will be shipped soon", 'Success', {
                //     timeOut: 3000,
                //     progressBar: true,
                //     positionClass: 'toast-top-center'
                //   });
                // }
            });

        },
        onClientAuthorization: (data) => {
            // console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
            // this.showSuccess = true;
            if(data.status === 'COMPLETED'){
              this.sum = (this.total + parseInt(this.shippingType));

              const obj = {
                order_address : this.orderForm.get('order_address')?.value,
                order_note : this.orderForm.get('order_note')?.value,
                order_payment : this.paymentMethod,
                order_phone : this.orderForm.get('order_phone')?.value,
                order_total_price : this.sum
              }

              this.apiOrder.addOrder(this.lstCartOrder, obj).subscribe(res => {
                this.orderForm.reset();
                this.toast.success("Your Transaction is successfull. \n Your transaction id is: " + data.id + " \n Your product will be shipped soon", 'Success', {
                  timeOut: 3000,
                  progressBar: true,
                  positionClass: 'toast-top-center'
                });

                setTimeout(() => {
                  window.location.reload();
                  this.broadcastChannel.postMessage('reload');
                }, 3000);
              },
              error => {
                this.toast.error(error.error.message, 'Error', {
                  timeOut: 3000,
                  progressBar: true,
                  positionClass: 'toast-top-center'
                });

                this.orderForm.reset();
              });
            }
        },
        onCancel: (data, actions) => {
            // console.log('OnCancel', data, actions);
            // this.showCancel = true;

        },
        onError: err => {
            // console.log('OnError', err);
            // this.showError = true;
        },
        onClick: (data, actions) => {
            // console.log('onClick', data, actions);
            // this.resetStatus();
        }
    };
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

  getCart(id:any){
    this.apiCart.getCart(id).subscribe(data => {
      this.lstCart = data.ds;
      this.tempTotal = data.total;
      this.total = data.total;

      this.lstCartOrder = [];

      for(var c of this.lstCart){
        if(c.isCheck === 'true'){
          this.lstCartOrder.push(c);
        }
      }
      this.qtyCart = this.lstCartOrder.length;
      // console.log(this.lstCartOrder);
    });
  }

  plusQty(id:number){
    this.apiCart.plusQty(id).subscribe(res => {
      this.getCart(this.cartID);
      this.lstCartOrder = []
    },
    error => {
      this.toast.error(error.error.message, 'Error', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
      });
    });
  }

  minusQty(id:number){
    this.apiCart.minusQty(id).subscribe(res => {
      this.getCart(this.cartID);
    });
  }

  deletecart(id:number){
    this.apiCart.deleteCart(id).subscribe(res => {
      this.toast.success(res.message, 'Success', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
      });

      this.getCart(this.cartID);
      this.modal.nativeElement.dismiss();
    },
    error => {
      this.toast.error(error.error.message, 'Error', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
      });
    });
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


  toggleCheckbox(cd_id:any, cart_id:any, qty:any, product_id:any, product_price:any) {
    const formData = new FormData();
    formData.append('id', cd_id);
    this.apiCart.setIsCheck(formData).subscribe();

    const index = this.lstCartOrder.findIndex((item: { cd_id: any; }) => item.cd_id === cd_id);
    if (index !== -1) {
      // If the item already exists, remove it
      this.lstCartOrder.splice(index, 1);
      const price = product_price * qty;
      this.total -= price;
      this.qtyCart = this.lstCartOrder.length;
      // this.getCart(this.cartID);
    } else {
      // If the item doesn't exist, add it
      const cart = {
        cd_id: cd_id,
        cd_cart_id: cart_id,
        cd_quantity: qty,
        cd_product_id: product_id,
        checked : true
      }
      const price = product_price * qty;
      this.total += price;
      this.lstCartOrder.push(cart);
      this.qtyCart = this.lstCartOrder.length;
    }
    // console.log(this.lstCartOrder);
  }

  addOrder(){
    if(this.role === "Customer"){
      if(this.lstCartOrder != ""){
        if(this.orderForm.valid){
          if(this.paymentMethod === 'Cash On Delivery'){
            this.disabled = false;
            this.sum = (this.total + parseInt(this.shippingType));

            const obj = {
              order_address : this.orderForm.get('order_address')?.value,
              order_note : this.orderForm.get('order_note')?.value,
              order_payment : this.paymentMethod,
              order_phone : this.orderForm.get('order_phone')?.value,
              order_total_price : this.sum
            }

            this.apiOrder.addOrder(this.lstCartOrder, obj).subscribe(res => {
              this.toast.success(res.message, 'Success', {
                timeOut: 3000,
                progressBar: true,
                positionClass: 'toast-top-center'
              });

              this.orderForm.reset();
              // this.ngOnInit();

              setTimeout(() => {
                window.location.reload();
              }, 3000);
            },
            error => {
              this.toast.error(error.error.message, 'Error', {
                timeOut: 3000,
                progressBar: true,
                positionClass: 'toast-top-center'
              });

              this.orderForm.reset();

              setTimeout(() => {
                window.location.reload();
              }, 3000);
            });
          }
          else{
            this.sum = (this.total + parseInt(this.shippingType));

            const obj = {
              order_address : this.orderForm.get('order_address')?.value,
              order_note : this.orderForm.get('order_note')?.value,
              order_payment : this.paymentMethod,
              order_phone : this.orderForm.get('order_phone')?.value,
              order_total_price : this.sum
            }

            this.apiOrder.addOrder(this.lstCartOrder, obj).subscribe(res => {
              // this.toast.success(res.message, 'Success', {
              //   timeOut: 3000,
              //   progressBar: true,
              //   positionClass: 'toast-top-center'
              // });

              this.orderForm.reset();
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
          ValidateForm.ValidateAllFormFileds(this.orderForm);
          this.toast.warning("Please enter required field to order!!!", 'Warning', {
            timeOut: 3000,
            progressBar: true,
            positionClass: 'toast-top-center'
          });
        }
      }
      else{
        ValidateForm.ValidateAllFormFileds(this.orderForm);
        this.toast.warning("Please add product to your cart to order!!!", 'Warning', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-center'
        });
      }
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
