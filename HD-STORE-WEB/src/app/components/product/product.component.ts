import { throwError } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiCartService } from 'src/app/Services/api-cart.service';
import { ApiProductService } from 'src/app/Services/api-product.service';
import { ApiService } from 'src/app/Services/api.service';
import { UserStoreService } from 'src/app/Services/user-store.service';
import { ApiImageService } from 'src/app/Services/api-image.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit{
  public lstProduct : any = [];
  public tempProduct : any = [];
  public lstSize : any = [];
  proName : string = "";
  proId : number = 0;
  path:string = '';

  fullname:string = '';
  role : string = "";

  cartID:number = 0;

  size : string = "";
  selectedSize: string | null = null;

  pageSize = 12;
  currentPage = 1;

  constructor(
    private apiProduct:ApiProductService,
    private router:Router,
    private apiCart:ApiCartService,
    private toast:ToastrService,
    private userStore:UserStoreService,
    private api:ApiService
  ){}

  ngOnInit(): void {
    this.viewAllProduct();

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
    });
  }

  viewAllProduct(){
    this.apiProduct.getAllProductWithStatusYes().subscribe(data => {
      this.lstProduct = data;
      this.path = this.apiProduct.PhotoUrl + "/";
    });
  }

  getDataToView(product_image:any){
    this.apiProduct.getProductByImage(product_image).subscribe(data => {
      this.apiProduct.setLstProduct(data);
    });
  }

  setProName(name:string){
    this.proName = name;

    this.getSize(this.proName);
  }

  getSize(proName:any){
    this.apiProduct.getProductSize(proName).subscribe(data => {
      this.lstSize = data.sort((a: { sizeNumber: number; }, b: { sizeNumber: number; }) => a.sizeNumber - b.sizeNumber);
    })
  }

  selectSize(size: string): void {
    this.selectedSize = (this.selectedSize === size) ? null : size;
    this.size = size;

    this.apiCart.getProduct(this.proName, Number(this.size)).subscribe(data => {
      this.tempProduct = data;
    });
  }

  addCart(qty:number){
    if(this.api.isLoggedIn()){
      if(this.selectedSize != undefined){
        this.selectedSize = "";
        for(const pro of this.tempProduct){
          this.proId = pro.cd_product_id;
          this.size = pro.size_number;
        }

        const obj = {
          cd_quantity : qty,
          cd_cart_id : this.cartID,
          cd_product_id : this.proId
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
        this.toast.warning("Please, choose the size", 'Warning!', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-center',
        });
      }
    }
    else{
      this.toast.warning("Please login first", 'Warning!', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center',
      });
      this.router.navigate(['login']);
    }
  }

}
