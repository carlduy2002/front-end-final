import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import ValidateForm from 'src/app/Helper/ValidateForm';
import { ApiCategoryService } from 'src/app/Services/api-category.service';
import { ApiService } from 'src/app/Services/api.service';
import { ShareService } from 'src/app/Services/share.service';
import { UserStoreService } from 'src/app/Services/user-store.service';

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.css']
})
export class UpdateCategoryComponent implements OnInit{
  categoryId : number = 0;
  public lstCategory : any = [];
  categoryForm !:FormGroup;

  role : string = "";
  fullname : string = "";

  constructor(
    private apiCategory:ApiCategoryService,
    private toast:ToastrService,
    private activatedRouter:ActivatedRoute,
    private shareService:ShareService,
    private fb:FormBuilder,
    private route:Router,
    private userStore:UserStoreService,
    private api:ApiService
  ){}

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      c_id : [0, Validators.required],
      c_name: ['', [Validators.required, Validators.max(30)]],
      c_description: [''],
      c_status: ['', Validators.required]
    });

    this.apiCategory.getLstCategory().subscribe(
      data => {
        this.lstCategory = data;

        this.categoryForm.patchValue({
          c_id : this.lstCategory.category_id,
          c_name : this.lstCategory.category_name,
          c_description : this.lstCategory.category_description,
          c_status : this.lstCategory.category_status
        });
      }
    );

    this.userStore.getRoleFromStore().subscribe(res => {
      let roleFromToken = this.api.getRoleFromToken();
      this.role = res || roleFromToken;
    });

    this.userStore.getFullNameFromStore().subscribe(res => {
      let fullNameFromToken = this.api.getFullNameFormToken();
      this.fullname = res || fullNameFromToken;
    });
  }

  callTest(): void {
    this.shareService.triggerLoad();
  }

  updateCategory(){
    if(this.categoryForm.valid){
      if(this.role === 'Admin'){
        this.apiCategory.updateCategory(this.categoryForm.value).subscribe(res => {
          this.toast.success(res.message, 'Success', {
            timeOut: 3000,
            progressBar: true,
            positionClass: 'toast-top-center',
          });

          this.callTest();
          this.route.navigate(['/view-category']);
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
        formData.append('category_id', this.categoryForm.get('c_id')?.value);
        formData.append('adder', this.fullname);
        formData.append('category_name', this.categoryForm.get('c_name')?.value);
        formData.append('category_status', this.categoryForm.get('c_status')?.value);
        formData.append('category_description', this.categoryForm.get('c_description')?.value);

        this.apiCategory.updateCategoryByManager(formData).subscribe(res => {
          this.toast.success(res.message, 'Success', {
            timeOut: 3000,
            progressBar: true,
            positionClass: 'toast-top-center',
          });

          this.callTest();
          this.route.navigate(['/view-category']);
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
      ValidateForm.ValidateAllFormFileds(this.categoryForm);
    }
  }
}
