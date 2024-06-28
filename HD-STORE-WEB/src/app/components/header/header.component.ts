import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ApiCategoryService } from 'src/app/Services/api-category.service';
import { ApiProductService } from 'src/app/Services/api-product.service';
import { ApiService } from 'src/app/Services/api.service';
import { ShareService } from 'src/app/Services/share.service';
import { UserStoreService } from 'src/app/Services/user-store.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
  public fullname:string = "";
  public role:string = "";
  public n : string = "none";
  public m : string = "block";

  searchForm !: FormGroup;

  public lstCategory : any = [];

  display:boolean = true;

  private subscription!: Subscription;

  key:string = '';

  constructor(
    private api:ApiService,
    private userStore:UserStoreService,
    private apiCategory:ApiCategoryService,
    private route:Router,
    private shareService:ShareService,
    private toast:ToastrService,
    private fb:FormBuilder,
  ){
    this.subscription = this.shareService.testFunctionTriggered$.subscribe(() => {
      this.getCategory();
    });
  }

  ngOnInit(): void {
    this.userStore.getFullNameFromStore().subscribe(res => {
      let fullNameFromToken = this.api.getFullNameFormToken();
      this.fullname = res || fullNameFromToken;
    });

    this.searchForm = this.fb.group({
      searchKey: ['', Validators.required],
    });

    this.getCategory();

    this.userStore.getRoleFromStore().subscribe(res => {
      let roleFromToken = this.api.getRoleFromToken();
      this.role = res || roleFromToken;

      if(this.role != undefined){
        this.m = "none";
        this.n = "block";
      }
    });

    this.userStore.setRoleForStore(this.role);
  }

  getCategory(){
    this.apiCategory.getCategoryUsed().subscribe(data => {
      this.lstCategory = data;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  callTest(): void {
    this.shareService.triggerLoad();
  }

  signOut(){
    this.api.signOut();
    this.n = "none";
    this.m = "block";
    this.role = "";
    this.fullname = "";
    this.userStore.setRoleForStore(this.role);
    // this.callTest();
    this.ngOnInit();
  }

  showDropdown(){
    this.display =! this.display;
  }

  chooseCategory(item:any){
    this.route.navigate(["/" + item.category_name]);
  }

  toggleSearch(){
    if(this.key == ''){
      this.route.navigate(['/product']);
    }
  }

  search(){
    if(this.searchForm.valid){
      const keySearch = this.searchForm.get('searchKey')?.value;
      this.route.navigate(['/view-product-search', keySearch]);
    }else{
      this.toast.warning("No data to search!", 'Warning', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
      });
    }
  }

  searchByCategory(categoryName:any){
    this.route.navigate(['/view-product-category', categoryName]);
  }
}
