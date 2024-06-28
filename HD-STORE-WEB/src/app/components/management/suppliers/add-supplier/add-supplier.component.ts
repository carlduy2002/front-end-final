import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import ValidateForm from 'src/app/Helper/ValidateForm';
import { ApiSupplierService } from 'src/app/Services/api-supplier.service';

@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-supplier.component.html',
  styleUrls: ['./add-supplier.component.css']
})
export class AddSupplierComponent implements OnInit{

  supplierForm!: FormGroup

  constructor(
    private apiSupplier:ApiSupplierService,
    private fb:FormBuilder,
    private toast:ToastrService,
    private route:Router
  ){}

  ngOnInit(): void {
    this.supplierForm = this.fb.group({
      supplier_name: ['', [Validators.required, Validators.max(30)]],
      supplier_email: ['', [Validators.required, Validators.pattern(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}/)]],
      supplier_address: ['', Validators.required],
      supplier_phone: ['', [Validators.required, Validators.pattern(/^(03|05|09|07|08)[0-9]{8}$/), Validators.min(10)]],
      supplier_status: [0, Validators.required]
    })
  }

  addSupplier(){
    if(this.supplierForm.valid){
      this.apiSupplier.addSupplier(this.supplierForm.value).subscribe(res => {
        this.toast.success(res.message, 'Success', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-center'
        });

        this.route.navigate(['/view-supplier']);
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
      ValidateForm.ValidateAllFormFileds(this.supplierForm);
      this.toast.warning("Please, enter all required fields to add supplier", 'Warning', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
      });
    }
  }

}
