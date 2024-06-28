import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import ValidateForm from 'src/app/Helper/ValidateForm';
import { ApiService } from 'src/app/Services/api.service';
import { SizeService } from 'src/app/Services/size.service';
import { UserStoreService } from 'src/app/Services/user-store.service';

@Component({
  selector: 'app-update-size',
  templateUrl: './update-size.component.html',
  styleUrls: ['./update-size.component.css']
})
export class UpdateSizeComponent implements OnInit{
  sizeForm!:FormGroup
  size_id : number = 0;
  role : string = "";
  fullname : string = "";
  public lstSize : any = [];


  constructor(
    private sizeApi:SizeService,
    private toast:ToastrService,
    private fb:FormBuilder,
    private route:Router,
    private userStore:UserStoreService,
    private api:ApiService,
    private activatedRouter:ActivatedRoute
  ){}

  ngOnInit(): void {
    this.sizeForm = this.fb.group({
      size_id : [0, Validators.required],
      size_number: ['', [Validators.required, Validators.min(37), Validators.max(45), Validators.pattern(/\d{2}/)]]
    });

    this.sizeApi.getLstSize().subscribe(data => {
      this.lstSize = data;

      this.sizeForm.patchValue({
        size_id : this.lstSize.size_id,
        size_number : this.lstSize.size_number
      });
    })

    this.userStore.getRoleFromStore().subscribe(res => {
      let roleFromToken = this.api.getRoleFromToken();
      this.role = res || roleFromToken;
    });

    this.userStore.getFullNameFromStore().subscribe(res => {
      let fullNameFromToken = this.api.getFullNameFormToken();
      this.fullname = res || fullNameFromToken;
    });
  }

  updateSize(){
    if(this.sizeForm.valid){
      this.sizeApi.updateSize(this.sizeForm.value).subscribe(res => {
        this.toast.success(res.message, 'Success', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-center'
        });

        this.route.navigate(['/view-size']);
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
      ValidateForm.ValidateAllFormFileds(this.sizeForm);
      this.toast.warning("Please, enter the required fields to update size", 'Warning!', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center',
      })
    }
  }
}
