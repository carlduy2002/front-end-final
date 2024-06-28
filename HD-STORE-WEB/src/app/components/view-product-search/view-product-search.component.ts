import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiCartService } from 'src/app/Services/api-cart.service';
import { ApiCategoryService } from 'src/app/Services/api-category.service';
import { ApiProductService } from 'src/app/Services/api-product.service';
import { ApiService } from 'src/app/Services/api.service';
import { UserStoreService } from 'src/app/Services/user-store.service';

@Component({
  selector: 'app-view-product-search',
  templateUrl: './view-product-search.component.html',
  styleUrls: ['./view-product-search.component.css']
})
export class ViewProductSearchComponent implements OnInit{
  key:string = '';
  categoryKey:string = '';

  lstProduct : any = [];
  lstSize : any = [];
  tempProduct : any = [];
  path:string = '';

  fullname:string = '';
  role : string = "";

  cartID:number = 0;

  proId : number = 0;

  proName : string = "";

  size : string = "";
  selectedSize: string | null = null;

  pageSize = 12;
  currentPage = 1;

  constructor(
    private activatedRouter: ActivatedRoute,
    private apiProduct:ApiProductService,
    private toast: ToastrService,
    private api:ApiService,
    private userStore:UserStoreService,
    private apiCart: ApiCartService,
    private router:Router
  ){}

  ngOnInit(): void {
    this.activatedRouter.params.subscribe((params) => {
      this.key = params['key'];
      this.search(this.key);
      this.path = this.apiProduct.PhotoUrl + "/";
    });

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

  search(key:any){
    this.apiProduct.search(key).subscribe(data => {
      this.lstProduct = data;
    },
    error => {
      this.toast.error(error.error.message, 'Error', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
      });

      this.router.navigate(['/product']);
    })
  }

  setProName(name:string){
    this.proName = name;

    this.getSize(this.proName);
  }

  getSize(proName:any){
    this.apiProduct.getProductSize(proName).subscribe(data => {
      this.lstSize = data.sort((a: { size_number: number; }, b: { size_number: number; }) => a.size_number - b.size_number);
    });
  }

  getDataToView(product_image:any){
    this.apiProduct.getProductByImage(product_image).subscribe(data => {
      this.apiProduct.setLstProduct(data);
    });
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
