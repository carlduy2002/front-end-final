import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import ValidateForm from 'src/app/Helper/ValidateForm';
import { ApiSupplierService } from 'src/app/Services/api-supplier.service';

@Component({
  selector: 'app-update-supplier',
  templateUrl: './update-supplier.component.html',
  styleUrls: ['./update-supplier.component.css']
})
export class UpdateSupplierComponent implements OnInit{
  supplierId:number = 0;
  supplierForm !: FormGroup;
  public lstSupplier : any = [];

  constructor(
    private apiSupplier:ApiSupplierService,
    private toast:ToastrService,
    private activatedRoute:ActivatedRoute,
    private fb:FormBuilder,
    private route:Router
  ){}

  ngOnInit(): void {
    this.supplierForm = this.fb.group({
      supplier_id: [0, Validators.required],
      supplier_name: ['', [Validators.required, Validators.max(30)]],
      supplier_email: ['', [Validators.required, Validators.pattern(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}/)]],
      supplier_address: ['', Validators.required],
      supplier_phone: ['', [Validators.required, Validators.pattern(/^(03|05|09|07|08)[0-9]{8}$/), Validators.min(10)]],
      supplier_status: ['', Validators.required]
    });

    this.apiSupplier.getLstSupplier().subscribe(data => {
      this.lstSupplier = data;

      this.supplierForm.patchValue({
        supplier_id : this.lstSupplier.supplier_id,
        supplier_name : this.lstSupplier.supplier_name,
        supplier_email : this.lstSupplier.supplier_email,
        supplier_address : this.lstSupplier.supplier_address,
        supplier_phone : this.lstSupplier.supplier_phone,
        supplier_status : this.lstSupplier.supplier_status
      });
    });
  }
  
  updateSupplier(){
    if(this.supplierForm.valid){
      this.apiSupplier.updateSupplier(this.supplierForm.value).subscribe(res => {
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
      });
    }
    else{
      ValidateForm.ValidateAllFormFileds(this.supplierForm);
    }
  }
}
