import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiCartService } from 'src/app/Services/api-cart.service';
import { ApiProductService } from 'src/app/Services/api-product.service';
import { ApiService } from 'src/app/Services/api.service';
import { StatisticService } from 'src/app/Services/statistic.service';
import { UserStoreService } from 'src/app/Services/user-store.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomepageComponent implements OnInit{
  public lstImage : any = [];
  public tempProduct : any = [];
  public lstSize : any = [];
  public lstProduct : any = [];

  path : string = "";
  pathProduct:string = '';
  fullname:string = '';
  role : string = "";
  size : string = "";
  selectedSize: string | null = null;
  proName : string = "";

  currentIndex: number = 0;
  cartID:number = 0;
  proId : number = 0;


  constructor(
    private productApi:ApiProductService,
    private router:Router,
    private apiCart:ApiCartService,
    private toast:ToastrService,
    private userStore:UserStoreService,
    private api:ApiService,
    private statisticApi:StatisticService
  ){}

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true
  }

  ngOnInit(): void {
    this.getImage();
    this.startCarousel();

    this.getBestSeller();

    this.userStore.getFullNameFromStore().subscribe(res => {
      let fullNameFromToken = this.api.getFullNameFormToken();
      this.fullname = res || fullNameFromToken;
    })

    this.userStore.getRoleFromStore().subscribe(res => {
      let roleFromToken = this.api.getRoleFromToken();
      this.role = res || roleFromToken;
    });

    if(this.fullname != undefined){
      this.api.getUserId(this.fullname).subscribe(data => {
        this.cartID = data;
      });
    }
  }


  startCarousel() {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.lstImage.length;
    }, 5000); // Switch every 5 seconds
  }

  getImage(){
    this.path = this.productApi.Thumbnail + '/'
    this.lstImage.push(this.path + 'thumbnail1.png');
    this.lstImage.push(this.path + 'thumbnail2.png');
  }

  getBestSeller(){
    const date = new Date();
    const currentYear = date.getUTCFullYear();

    this.statisticApi.getBestSell(currentYear).subscribe(data => {
      this.lstProduct = data;
      this.pathProduct = this.productApi.PhotoUrl + "/";
    });
  }

  setProName(name:string){
    this.proName = name;

    this.getSize(this.proName);
  }

  getDataToView(product_image:any){
    this.productApi.getProductByImage(product_image).subscribe(data => {
      this.productApi.setLstProduct(data);
    });
  }

  getSize(proName:any){
    this.productApi.getProductSize(proName).subscribe(data => {
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
      })
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
