import { style } from '@angular/animations';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { ApiCartService } from 'src/app/Services/api-cart.service';
import { ApiImageService } from 'src/app/Services/api-image.service';
import { ApiProductService } from 'src/app/Services/api-product.service';
import { ApiService } from 'src/app/Services/api.service';
import { UserStoreService } from 'src/app/Services/user-store.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit{
  public lstProduct : any = [];
  public lstSize : any = [];
  public lstImage : any = [];
  public tempProduct : any = [];
  public lstRelatedProduct : any = [];
  public listImage : any[] = [];
  public image : any[] = [];

  cartID:number = 0;
  productId : number = 0;
  categoryId:number = 0;

  path:string = '';
  fullname:string = '';
  role : string = "";
  size:string = '';
  proName:string = '';
  proImage : string = "";
  selectedSize: string | null = null;
  pathImage : string = "";
  getPath : string = "";
  productImage !: string;
  productDescription : string = "";

  proQty:number = 1;

  @Output() sizeSelected = new EventEmitter<string>();

  constructor(
    private apiProduct:ApiProductService,
    private activatedRouter:ActivatedRoute,
    private apiCart:ApiCartService,
    private userStore:UserStoreService,
    private api:ApiService,
    private toast:ToastrService,
    private apiImage:ApiImageService,
    private router:Router,
  ){}


  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true
  }

  ngOnInit(): void {
    this.apiProduct.getLstProduct().subscribe(data => {
      this.lstProduct = data;
      for(var p of this.lstProduct){
        this.productImage = p.product_image;
      }
      this.getProduct(this.productImage);
      this.getImage(this.productImage);
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

  setImage(image:any){
    this.apiProduct.getProductByImage(image).subscribe(data => {
      this.apiProduct.setLstProduct(data);
    });
  }

  getProduct(product_image:string){
    this.selectedSize = "";
    this.pathImage = this.apiProduct.Image + "/";
    this.path = this.apiProduct.PhotoUrl + "/";
    this.apiProduct.getProductByImage(product_image).subscribe(data => {
      this.lstProduct = data;

      for(const pro of this.lstProduct){
        this.proName = pro.product_name;
        this.categoryId = pro.p_category_id;
        this.proImage = pro.product_image;
        this.productDescription =pro.product_description.replace(/\r\n/g, '<br>');
      }

      this.apiProduct.getPath(this.proImage).subscribe(res => {
        this.getPath = res.path;

        const formData = new FormData();
        formData.append('file_path', this.getPath);

        this.api.sendImageToPython(formData).subscribe(res => {
          this.listImage = res.message;

          this.image = [];
          for(const i of this.listImage){
            const parts = i.split(/[\\/]/);
            const files = parts[parts.length - 1];

            this.image.push(files);
          }
        },
        error => {
          this.toast.error('Do not have any related product', 'success', {
            timeOut: 3000,
            progressBar: true,
            positionClass: 'toast-top-center'
          });
        });
      });

      this.getSize(this.proName);
    });
  }

  getImage(product_image:string){
    this.apiImage.GetImageByProId(product_image).subscribe(data => {
      this.lstImage = data;

      // console.log(this.lstImage);
    });
  }

  getSize(proName:any){
    this.apiProduct.getProductSize(proName).subscribe(data => {
      this.lstSize = data.sort((a: { sizeNumber: number; }, b: { sizeNumber: number; }) => a.sizeNumber - b.sizeNumber);
    })
  }

  getQty(event:any){
    this.proQty = event.target.value;
  }

  selectSize(size: string): void {
    this.selectedSize = (this.selectedSize === size) ? null : size;
    this.size = size;

    this.apiCart.getProduct(this.proName, Number(this.size)).subscribe(data => {
      this.tempProduct = data;
    });
  }

  addCart(){
    if(this.api.isLoggedIn()){
      if(this.size != ""){
        const pattern = /^[0-9]+$/;
        if(pattern.test(this.proQty.toString())){
          for(const pro of this.tempProduct){
            this.productId = pro.cd_product_id;
            this.size = pro.size_number;
          }

          const obj = {
            cd_quantity : this.proQty,
            cd_cart_id : this.cartID,
            cd_product_id : this.productId,
            // cd_product_size : this.size
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
          this.toast.error('Quantity must be an positive number', 'Error', {
            timeOut: 3000,
            progressBar: true,
            positionClass: 'toast-top-center'
          });
        }
      }
      else{
        this.toast.warning('Please, choose the size', 'Warning', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-center'
        });
      }
    }
    else{
      this.toast.warning("Please login first", 'Warning!', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center',
      })
      this.router.navigate(['login']);
    }
  }
}
function sanitizeHtml(html: any, string: any) {
  throw new Error('Function not implemented.');
}

