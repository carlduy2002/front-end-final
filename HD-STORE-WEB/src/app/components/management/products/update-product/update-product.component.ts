import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import ValidateForm from 'src/app/Helper/ValidateForm';
import { ApiCategoryService } from 'src/app/Services/api-category.service';
import { ApiImageService } from 'src/app/Services/api-image.service';
import { ApiProductService } from 'src/app/Services/api-product.service';
import { ApiSupplierService } from 'src/app/Services/api-supplier.service';
import { ApiService } from 'src/app/Services/api.service';
import { SizeService } from 'src/app/Services/size.service';
import { UserStoreService } from 'src/app/Services/user-store.service';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent implements OnInit{
  public lstProduct:any = [];
  public lstSize:any = [];
  public lstImage:any = [];
  public lstCategory : any = [];
  public lstSupplier : any = [];
  public productId : number = 0;

  path:string = '';
  selectCategory : string = '';
  selectSupplier : string = '';
  selectSize: string = '';

  productForm!:FormGroup;
  image:any;
  uri:string = '';
  listFile!: FileList;
  showImage : boolean = false;
  hideImage : boolean = true;


  p_categoryName:string = '';
  p_supplierName:string = '';
  p_productSize:number = 0;
  p_image:string = '';

  role : string = "";
  fullname : string = "";

  constructor(
    private fb:FormBuilder,
    private apiProduct:ApiProductService,
    private activatedRouter:ActivatedRoute,
    private apiCategory:ApiCategoryService,
    private apiSupplier:ApiSupplierService,
    private toast:ToastrService,
    private sizeApi:SizeService,
    private route:Router,
    private userStore:UserStoreService,
    private api:ApiService
  ){}

  ngOnInit(): void {
    this.path = this.apiProduct.PhotoUrl + "/";

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

    this.apiSupplier.getAllSupplier().subscribe(data => {
      this.lstSupplier = data;
    });

    this.productForm = this.fb.group({
      product_id: ['', Validators.required],
      product_name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]/)]],
      product_quantity: ['', [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.min(1), Validators.max(1000)]],
      product_originalPrice: ['', [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.min(1), Validators.max(10000)]],
      product_sellPrice: ['', [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.min(2), Validators.max(10000)]],
      product_description: [''],
      product_status: ['', Validators.required],
      p_category_id: [0, Validators.required],
      p_supplier_id: [0, Validators.required],
      p_size_id: [0, Validators.required],
    });

    this.apiProduct.getLstProduct().subscribe(data => {
      this.lstProduct = data;

      for(const data of this.lstProduct){
        this.productForm.patchValue({
          product_id : data.product_id,
          product_name : data.product_name,
          product_quantity: data.product_quantity_stock,
          product_originalPrice: data.product_original_price,
          product_sellPrice: data.product_sell_price,
          product_description: data.product_description,
          product_status: data.product_status,
          p_category_id: data.p_category_id,
          p_supplier_id: data.p_supplier_id,
          p_size_id: data.p_size_id
        });

        this.p_categoryName = data.category_name;
        this.p_supplierName = data.supplier_name;
        this.p_productSize = data.size_number;
        this.p_image = data.product_image;

        this.getSize();
      }
    },
    error => {
      // console.error("Error fetching category data in BComponent:", error);
    });
  }

  uploadImage(event:any){
    this.listFile = event.target.files;
  }

  getSize(){
    this.sizeApi.getAllSizes().subscribe(data => {
      this.lstSize = data.sort((a: { size_number: number; }, b: { size_number: number; }) => a.size_number - b.size_number);
    })
  }

  updateProduct(){
    if(this.productForm.valid){
      if(this.role === 'Admin'){
        if(this.listFile == undefined){
          const formData = new FormData();

          formData.append('product_id', this.productForm.get('product_id')?.value);
          formData.append('product_name', this.productForm.get('product_name')?.value);
          formData.append('product_quantity', this.productForm.get('product_quantity')?.value);
          formData.append('product_originalPrice', this.productForm.get('product_originalPrice')?.value);
          formData.append('product_sellPrice', this.productForm.get('product_sellPrice')?.value);
          formData.append('product_description', this.productForm.get('product_description')?.value);
          formData.append('p_category_id', this.productForm.get('p_category_id')?.value);
          formData.append('p_supplier_id', this.productForm.get('p_supplier_id')?.value);
          formData.append('p_size_id', this.productForm.get('p_size_id')?.value);
          formData.append('product_status', this.productForm.get('product_status')?.value);
          formData.append('product_image', this.p_image);

          this.apiProduct.updateProduct(formData).subscribe(data =>{
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
        else{
          const formData = new FormData();

          for(let i = 0; i < this.listFile.length; i++){
            formData.append('files', this.listFile[i]);
          }

          formData.append('product_id', this.productForm.get('product_id')?.value);
          formData.append('product_name', this.productForm.get('product_name')?.value);
          formData.append('product_quantity', this.productForm.get('product_quantity')?.value);
          formData.append('product_originalPrice', this.productForm.get('product_originalPrice')?.value);
          formData.append('product_sellPrice', this.productForm.get('product_sellPrice')?.value);
          formData.append('product_description', this.productForm.get('product_description')?.value);
          formData.append('p_category_id', this.productForm.get('p_category_id')?.value);
          formData.append('p_supplier_id', this.productForm.get('p_supplier_id')?.value);
          formData.append('p_size_id', this.productForm.get('p_size_id')?.value);
          formData.append('product_status', this.productForm.get('product_status')?.value);
          formData.append('product_image', this.p_image);

          this.apiProduct.updateProduct(formData).subscribe(data =>{
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
        if(this.listFile == undefined){
          const formData = new FormData();

          formData.append('product_id', this.productForm.get('product_id')?.value);
          formData.append('product_name', this.productForm.get('product_name')?.value);
          formData.append('product_quantity', this.productForm.get('product_quantity')?.value);
          formData.append('product_originalPrice', this.productForm.get('product_originalPrice')?.value);
          formData.append('product_sellPrice', this.productForm.get('product_sellPrice')?.value);
          formData.append('product_description', this.productForm.get('product_description')?.value);
          formData.append('p_category_id', this.productForm.get('p_category_id')?.value);
          formData.append('p_supplier_id', this.productForm.get('p_supplier_id')?.value);
          formData.append('p_size_id', this.productForm.get('p_size_id')?.value);
          formData.append('product_status', this.productForm.get('product_status')?.value);
          formData.append('product_image', this.p_image);
          formData.append('updater', this.fullname);

          this.apiProduct.updateProductByManager(formData).subscribe(data =>{
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
        else{
          const formData = new FormData();

          for(let i = 0; i < this.listFile.length; i++){
            formData.append('files', this.listFile[i]);
          }

          formData.append('product_id', this.productForm.get('product_id')?.value);
          formData.append('product_name', this.productForm.get('product_name')?.value);
          formData.append('product_quantity', this.productForm.get('product_quantity')?.value);
          formData.append('product_originalPrice', this.productForm.get('product_originalPrice')?.value);
          formData.append('product_sellPrice', this.productForm.get('product_sellPrice')?.value);
          formData.append('product_description', this.productForm.get('product_description')?.value);
          formData.append('p_category_id', this.productForm.get('p_category_id')?.value);
          formData.append('p_supplier_id', this.productForm.get('p_supplier_id')?.value);
          formData.append('p_size_id', this.productForm.get('p_size_id')?.value);
          formData.append('product_status', this.productForm.get('product_status')?.value);
          formData.append('product_image', this.p_image);
          formData.append('updater', this.fullname);

          this.apiProduct.updateProductByManager(formData).subscribe(data =>{
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
    }
    else{
      ValidateForm.ValidateAllFormFileds(this.productForm);
    }
  }

}
