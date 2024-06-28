import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiSupplierService } from 'src/app/Services/api-supplier.service';

@Component({
  selector: 'app-view-supplier',
  templateUrl: './view-supplier.component.html',
  styleUrls: ['./view-supplier.component.css']
})
export class ViewSupplierComponent implements OnInit{

  public lstSupplier : any = [];
  searchTerm : string = '';
  supplierid : number = 0;

  pageSize = 10;
  currentPage = 1;

  constructor(
    private apiSupplier:ApiSupplierService,
    private toast:ToastrService,
  ){}

  ngOnInit(): void {
   this.viewAllSupplier();
  }

  viewAllSupplier(){
    this.apiSupplier.getAllSupplier().subscribe(data => {
      this.lstSupplier = data;
    })
  }

  toggleSearchButton(): void {
    if (this.searchTerm.trim() === '') {
      this.viewAllSupplier();
    }
  }

  search(){
    this.apiSupplier.search(this.searchTerm).subscribe(data => {
      this.lstSupplier = data;
    },
    error => {
      this.toast.error(error.error.message, 'Error', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
      });
    })
  }

  getSupplierId(id:number){
    this.supplierid = id;
  }

  getDataToUpdate(supplier_id:any){
    this.apiSupplier.getSupplierById(supplier_id).subscribe(data => {
      this.apiSupplier.setLstSupplier(data);
    });
  }

  deleteSupplier(){
    this.apiSupplier.deleteSupplier(this.supplierid).subscribe(res => {
      this.toast.success(res.message, 'Success', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
      });

      this.viewAllSupplier();
    },
    error => {
      this.toast.error(error.error.message, 'Error', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
      });
    });
  }
}
