import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StatisticService } from 'src/app/Services/statistic.service';

@Component({
  selector: 'app-statistical',
  templateUrl: './statistical.component.html',
  styleUrls: ['./statistical.component.css']
})
export class StatisticalComponent implements OnInit{
  public statistics : any = [];

  years : number[] = [];
  statisticForm !: FormGroup;
  currentYear : number = 0;
  selectedYear : number = 0;

  pageSize = 10;
  currentPage = 1;

  constructor(
    private statisticAPI : StatisticService,
    private fb : FormBuilder
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

    this.statisticAPI.getTotalOrderInYear(year).subscribe(data => {
      this.statistics = data;
    });
  }
}
