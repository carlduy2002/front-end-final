import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import ValidateForm from 'src/app/Helper/ValidateForm';
import { ApiCategoryService } from 'src/app/Services/api-category.service';
import { ApiService } from 'src/app/Services/api.service';
import { ShareService } from 'src/app/Services/share.service';
import { UserStoreService } from 'src/app/Services/user-store.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit{
  categoryForm!:FormGroup

  role : string = "";
  fullname : string = "";

  constructor(
    private apiCategory:ApiCategoryService,
    private toast:ToastrService,
    private fb:FormBuilder,
    private shareService:ShareService,
    private route:Router,
    private userStore:UserStoreService,
    private api:ApiService
  ){}

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      category_name: ['', [Validators.required, Validators.max(30)]],
      category_description: [''],
      category_status: [0, Validators.required]
    });

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

  addCategory(){
    if(this.categoryForm.valid){
      if(this.role === 'Admin'){
        if(this.categoryForm.get('category_status')?.value == 0){
          this.toast.warning('Please, choose the status', 'Warning', {
            timeOut: 3000,
            progressBar: true,
            positionClass: 'toast-top-center',
          });
        }
        else{
          this.apiCategory.addCategory(this.categoryForm.value).subscribe(data => {
            this.toast.success(data.message, 'Success', {
              timeOut: 3000,
              progressBar: true,
              positionClass: 'toast-top-center',
            });

            this.callTest();
            this.route.navigate(['/view-category']);
          },
          error => {
            this.toast.error(error.error.message, 'Success', {
              timeOut: 3000,
              progressBar: true,
              positionClass: 'toast-top-center',
            });
          });
        }
      }
      else{
        const formData = new FormData();
          formData.append('adder', this.fullname);
          formData.append('category_name', this.categoryForm.get('category_name')?.value);
          formData.append('category_status', this.categoryForm.get('category_status')?.value);
          formData.append('category_description', this.categoryForm.get('category_description')?.value);


          this.apiCategory.addCategoryByManager(formData).subscribe(data => {
            this.toast.success(data.message, 'Success', {
              timeOut: 3000,
              progressBar: true,
              positionClass: 'toast-top-center',
            });

            this.callTest();
            this.route.navigate(['/view-category']);
          },
          error => {
            this.toast.error(error.error.message, 'Success', {
              timeOut: 3000,
              progressBar: true,
              positionClass: 'toast-top-center',
            });
          });
      }
    }
    else{
      ValidateForm.ValidateAllFormFileds(this.categoryForm);
      this.toast.warning("Please, enter the required fields to add category", 'Warning!', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center',
      })
    }
  }

}
