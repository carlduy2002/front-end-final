import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiProductService } from 'src/app/Services/api-product.service';
import { StatisticService } from 'src/app/Services/statistic.service';

@Component({
  selector: 'app-best-seller',
  templateUrl: './best-seller.component.html',
  styleUrls: ['./best-seller.component.css']
})
export class BestSellerComponent implements OnInit{
  public statistics : any = [];

  years : number[] = [];
  statisticForm !: FormGroup;
  path : string = '';
  selectedYear : number = 0;
  currentYear : number = 0;

  pageSize = 6;
  currentPage = 1;

  constructor(
    private statisticAPI : StatisticService,
    private fb : FormBuilder,
    private productAPI : ApiProductService
  ){}

  ngOnInit(): void {
    this.generateYears();

    this.statisticForm = this.fb.group({
      year : [0, Validators.required]
    });

    this.Statistic();
  }

  generateYears() {
    this.currentYear = new Date().getFullYear();
    this.selectedYear = this.currentYear;
    const startYear = this.currentYear - 5; // You can adjust the range as needed
    for (let year = startYear; year <= this.currentYear; year++) {
      this.years.push(year);
    }
  }

  Statistic(){
    const year = this.statisticForm.get('year')?.value;

    this.statisticAPI.getBestSeller(year).subscribe(data => {
      this.statistics = data.sort((a: { total_sale: number; }, b: { total_sale: number; }) => b.total_sale - a.total_sale);
      this.path = this.productAPI.PhotoUrl + "/";
    });
  }
}
