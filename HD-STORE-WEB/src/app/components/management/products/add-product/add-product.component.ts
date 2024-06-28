import { state } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { zipAll, throwError } from 'rxjs';
import ValidateForm from 'src/app/Helper/ValidateForm';
import { ApiCategoryService } from 'src/app/Services/api-category.service';
import { ApiProductService } from 'src/app/Services/api-product.service';
import { ApiSupplierService } from 'src/app/Services/api-supplier.service';
import { ApiService } from 'src/app/Services/api.service';
import { SizeService } from 'src/app/Services/size.service';
import { UserStoreService } from 'src/app/Services/user-store.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit{
  public lstCategory : any = [];
  public lstSupplier : any = [];
  public lstSize : any = [];

  role : string = "";
  fullname : string = "";

  productForm!:FormGroup;
  selectCategory : string = '';
  selectSupplier : string = '';
  selectSize : string = '';
  categoryID:number = 0;
  supplierID:number = 0;
  sizeID:number = 0;
  path:any;
  image:any;
  uri:string = '';
  token = '';
  listFile!: FileList;

  isValidProductName !: boolean;
  isValidQuantity !: boolean;
  isValidOriginalPrice !: boolean;
  isValidSellPrice !: boolean;

  productNameField : string = "";
  productQuantityField : string = "";
  productOriginalPriceField : string = "";
  productSellPriceField : string = "";

  constructor(
    private apiCategory:ApiCategoryService,
    private apiSupplier:ApiSupplierService,
    private fb:FormBuilder,
    private toast:ToastrService,
    private apiProduct:ApiProductService,
    private api:ApiService,
    private sizeApi:SizeService,
    private route:Router,
    private userStore:UserStoreService
  ){}

  ngOnInit(): void {
    this.userStore.getRoleFromStore().subscribe(res => {
      let roleFromToken = this.api.getRoleFromToken();
      this.role = res || roleFromToken;
    });

    this.userStore.getFullNameFromStore().subscribe(res => {
      let fullNameFromToken = this.api.getFullNameFormToken();
      this.fullname = res || fullNameFromToken;
    });

    this.apiCategory.getCategoryUsed().subscribe(data => {
      this.lstCategory = data;
    });

    this.apiSupplier.getAllSupplierWithStatusYes().subscribe(data => {
      this.lstSupplier = data;
    });

    this.sizeApi.getAllSizes().subscribe(data => {
      this.lstSize = data.sort((a: { size_number: number; }, b: { size_number: number; }) => a.size_number - b.size_number);
    });

    this.productForm = this.fb.group({
      product_name: ['', Validators.required],
      product_quantity: ['', [Validators.required, Validators.min(1), Validators.max(1000)]],
      product_originalPrice: ['', [Validators.required, Validators.min(1), Validators.max(10000)]],
      product_sellPrice: ['', [Validators.required, Validators.min(2), Validators.max(10000)]],
      product_description: [''],
      p_category_id: [0, Validators.required],
      p_supplier_id: [0, Validators.required],
      p_size_id: [0, Validators.required]
    });

    this.token = JSON.stringify(this.api.getToken());
  }

  uploadImage(event:any){
    this.listFile = event.target.files;
  }

  checkValidProductName(event:string){
    const value = event;
    const pattern = /^[a-zA-Z]/;
    this.isValidProductName = pattern.test(value);

    return this.isValidProductName;
  }

  checkValidProductQuantity(event:any){
    const value = event;
    const pattern = /^[0-9]+$/;
    this.isValidQuantity = pattern.test(value);

    return this.isValidQuantity;
  }

  checkValidProductOriginalPrice(event:any){
    const value = event;
    const pattern = /^[0-9]+$/;
    this.isValidOriginalPrice = pattern.test(value);

    return this.isValidOriginalPrice;
  }

  checkValidProductSellPrice(event:any){
    const value = event;
    const pattern = /^[0-9]+$/;
    this.isValidSellPrice = pattern.test(value);

    return this.isValidSellPrice;
  }

  addProduct(){
    if(this.productForm.valid){
      if(this.listFile){
        if(this.role === 'Admin'){
          const formData = new FormData();
          for(let i = 0; i < this.listFile.length; i++){
            formData.append('files', this.listFile[i]);
          }

          formData.append('product_name', this.productForm.get('product_name')?.value);
          formData.append('product_quantity', this.productForm.get('product_quantity')?.value);
          formData.append('product_originalPrice', this.productForm.get('product_originalPrice')?.value);
          formData.append('product_sellPrice', this.productForm.get('product_sellPrice')?.value);
          formData.append('product_description', this.productForm.get('product_description')?.value);
          formData.append('p_category_id', this.productForm.get('p_category_id')?.value);
          formData.append('p_supplier_id', this.productForm.get('p_supplier_id')?.value);
          formData.append('p_size_id', this.productForm.get('p_size_id')?.value);

          this.apiProduct.addProduct(formData).subscribe(data =>{
            this.toast.success(data.message, 'Success', {
              timeOut: 3000,
              progressBar: true,
              positionClass: 'toast-top-center',
            });

            this.route.navigate(['/view-product']);
          },
          error => {
            this.toast.error(error.error.message, 'Error', {
              timeOut: 3000,
              progressBar: true,
              positionClass: 'toast-top-center',
            });
          });
        }else{
          const formData = new FormData();
          for(let i = 0; i < this.listFile.length; i++){
            formData.append('files', this.listFile[i]);
          }

          formData.append('product_name', this.productForm.get('product_name')?.value);
          formData.append('product_quantity', this.productForm.get('product_quantity')?.value);
          formData.append('product_originalPrice', this.productForm.get('product_originalPrice')?.value);
          formData.append('product_sellPrice', this.productForm.get('product_sellPrice')?.value);
          formData.append('product_description', this.productForm.get('product_description')?.value);
          formData.append('p_category_id', this.productForm.get('p_category_id')?.value);
          formData.append('p_supplier_id', this.productForm.get('p_supplier_id')?.value);
          formData.append('p_size_id', this.productForm.get('p_size_id')?.value);
          formData.append('adder', this.fullname);

          this.apiProduct.addProductByManager(formData).subscribe(data =>{
            this.toast.success(data.message, 'Success', {
              timeOut: 3000,
              progressBar: true,
              positionClass: 'toast-top-center',
            });

            this.route.navigate(['/view-product']);
          },
          error => {
            this.toast.error(error.error.message, 'Error', {
              timeOut: 3000,
              progressBar: true,
              positionClass: 'toast-top-center',
            });
          });
        }
      }
      else{
        this.toast.warning("Please, upload product's image", 'Warning!', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-center',
        });
      }
    }
    else{
      ValidateForm.ValidateAllFormFileds(this.productForm);
      this.toast.warning("Please, enter the required fields to add product", 'Warning!', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center',
      });
    }
  }

}

