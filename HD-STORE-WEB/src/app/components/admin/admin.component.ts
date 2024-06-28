import { DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import plugin from 'chartjs-plugin-datalabels';
import { Chart, plugins, registerables } from 'node_modules/chart.js';
import { ApiService } from 'src/app/Services/api.service';
import { StatisticService } from 'src/app/Services/statistic.service';
import { UserStoreService } from 'src/app/Services/user-store.service';
// import { labelChart} 'chartjs-plugin-datalabels';
import { data } from 'jquery';
import { auto } from '@popperjs/core';
Chart.register(...registerables);

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy{
  //Color
  red: string = '#ff014fff';
  white: string = 'white';
  //Button
  idButtonBar: string = 'btn-readMore1';
  idButtonLine: string = 'btn-readMore';
  idButtonRadar: string = 'btn-readMore';
  buttonBarLetter: string = this.white;
  buttonBarBackground: string = this.red;
  buttonLineLetter: string = this.red;
  buttonLineBackground: string = this.white;
  buttonRadarLetter: string = this.red;
  buttonRadarBackground: string = this.white;
  //Chart
  labelChart: string = 'Article';
  barChart: any;
  lineChart: any;
  radarChart: any;
  displayBarChart: string = 'block';
  displayLineChart: string = 'none';
  displayRadarChart: string = 'none';

  month : any[] = [];
  totalOrder : any[] = [];
  cancelOrder : any[] = [];
  deliveryOrder : any[] = [];
  pendingOrder : any[] = [];
  returnOrder : any[] = [];
  rejectOrder : any[] = [];
  awaitingOrder : any[] = [];
  bestSale : any[] = [];
  proName : any[] = [];
  years: number[] = [];
  yearsOrder:number[] = [];
  yearsProduct:number[] = [];
  months: { id: number, name: string }[] = [];
  revenue : any[] = [];

  role : string = "";
  fullname : string = "";

  statisticForm !: FormGroup;

  currentMonth : any;

  currentYear : number = 0;
  selectedYear : number = 0;
  selectedMonth : number = 0;

  selectedYearOrder : number = 0;
  selectedYearProduct : number = 0;

  // reload : boolean = false;

  constructor(
    private userStore:UserStoreService,
    private api:ApiService,
    private statisticAPI:StatisticService,
    private fb:FormBuilder,
  ){}


  ngOnInit(): void {
    this.userStore.getFullNameFromStore().subscribe(res => {
      let fullNameFromToken = this.api.getFullNameFormToken();
      this.fullname = res || fullNameFromToken;
    });

    this.userStore.getRoleFromStore().subscribe(res => {
      let roleFromToken = this.api.getRoleFromToken();
      this.role = res || roleFromToken;
    });

    this.getRevenue();
    this.generateYears();
    this.generateYearsOrder();
    this.generateYearsProduct();
    this.generateMonths();

    this.statisticForm = this.fb.group({
      month: [0, Validators.required],
      year: [0, Validators.required]
    });

    this.statisticForm = this.fb.group({
      month: [0, Validators.required],
      year: [0, Validators.required]
    });

    this.bestSeller();
    this.sort();
  }

  ngOnDestroy() {
    // Make sure to destroy the chart when the component is destroyed
    if (this.barChart) {
      this.barChart.destroy();
    }
  }

  ngOnDestroy1() {
    // Make sure to destroy the chart when the component is destroyed
    if (this.radarChart) {
      this.radarChart.destroy();
    }
  }

  generateMonths() {
    const date = new Date();
    const currentMonthIndex = date.getMonth(); // Get the index of the current month
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];

    for (let i = 0; i < monthNames.length; i++) {
      this.months.push({ id: i + 1, name: monthNames[i] });
    }

    // Add the current month at the beginning of the array
    // this.months.unshift({ id: currentMonthIndex + 1, name: monthNames[currentMonthIndex] });

    this.selectedMonth = currentMonthIndex + 1;
  }

  generateYears() {
    this.currentYear = new Date().getFullYear();
    this.selectedYear = this.currentYear;
    const startYear = this.currentYear - 5; // You can adjust the range as needed
    for (let year = startYear; year <= this.currentYear; year++) {
      this.years.push(year);
    }
  }

  generateYearsOrder() {
    this.currentYear = new Date().getFullYear();
    this.selectedYearOrder = this.currentYear;
    const startYear = this.currentYear - 5; // You can adjust the range as needed
    for (let year = startYear; year <= this.currentYear; year++) {
      this.yearsOrder.push(year);
    }
  }

  generateYearsProduct() {
    this.currentYear = new Date().getFullYear();
    this.selectedYearProduct = this.currentYear;
    const startYear = this.currentYear - 5; // You can adjust the range as needed
    for (let year = startYear; year <= this.currentYear; year++) {
      this.yearsProduct.push(year);
    }
  }

  getRevenue(){
    const date = new Date();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();

    this.statisticAPI.getTotalRevenueInMonthOfYear(month, year).subscribe(data => {
      this.revenue = data;
    });
  }

  sortRevenue(){
    const month = this.statisticForm.get('month')?.value;
    const year = this.statisticForm.get('year')?.value;

    if(month == 0 && year == 0){
      const date = new Date();
      this.currentMonth = date.getUTCMonth();
      this.currentYear = date.getUTCFullYear();

      this.statisticAPI.getTotalRevenueInMonthOfYear(this.currentMonth, this.currentYear).subscribe(data => {
        this.revenue = data;
      });
    }
    else{
      this.statisticAPI.getTotalRevenueInMonthOfYear(month, year).subscribe(data => {
        this.revenue = data;
      });
    }
  }

  bestSeller(){
    const year = this.statisticForm.get('year')?.value;
    this.statisticAPI.getBestSell(year).subscribe(data => {
      this.ngOnDestroy1();

      this.bestSale = [];
      this.proName = [];

      for(const datas of data){
        this.bestSale.push(datas.total_sale);
        this.proName.push(datas.product_name);
      }

      this.RadarChart();
    });
  }

  sort(){
    if(this.statisticForm.valid){
      const year = this.statisticForm.get('year')?.value;
      this.statisticAPI.getTotalOrderInYear(year).subscribe(data => {
        this.ngOnDestroy();

        this.month = [];

        for(const datas of data){
          this.month.push(datas.month);
          this.totalOrder.push(datas.total_orders);
          this.cancelOrder.push(datas.canceled_order);
          this.deliveryOrder.push(datas.delivered_order);
          this.pendingOrder.push(datas.pending_order);
          this.returnOrder.push(datas.returned_order);
          this.rejectOrder.push(datas.rejected_order);
          this.awaitingOrder.push(datas.awaiting_Pickup_order);
        }

        this.BarChart();
      });
    }
    else{
      alert('error');
    }
  }


  RadarChart() {
    const data = {
      labels: this.proName,
      datasets: [
        {
          label:
            'Number of Product',
          data: this.bestSale,
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            '#71b657',
            '#e3632d',
            '#6c757d',
          ],
          hoverOffset: 4,
        },
      ],
    };

    this.radarChart = new Chart('pieChart', {
      type: 'pie',
      data: data,
      options: {
        plugins: {
          datalabels: {
            color: '#fff',
          }
        }
      },
      plugins: [plugin]
    });
  }

  BarChart() {
    this.barChart = new Chart('barChart', {
      type: 'bar',
      data: {
        labels: this.month,
        datasets: [
          {
            label: 'Total Order',

            data: this.totalOrder,
            backgroundColor: ['rgb(210,209,2, 0.2)'],
            borderColor: ['rgb(210,209,2)'],
            borderWidth: 1,
          },
          {
            label: 'Total Delivered',

            data: this.deliveryOrder,
            backgroundColor: ['rgb(27,255,10, 0.2)'],
            borderColor: ['rgb(27,255,10)'],
            borderWidth: 1,
          },
          {
            label: 'Total Cancel',

            data: this.cancelOrder,
            backgroundColor: ['rgb(255,16,10, 0.2)'],
            borderColor: ['rgb(255,16,10)'],
            borderWidth: 1,
          },
          {
            label: 'Total Reject',

            data: this.rejectOrder,
            backgroundColor: ['rgb(217,88,30, 0.2)'],
            borderColor: ['rgb(217,88,30)'],
            borderWidth: 1,
          },
          {
            label: 'Total Return',

            data: this.returnOrder,
            backgroundColor: ['rgb(10,21,255, 0.2)'],
            borderColor: ['rgb(10,21,255)'],
            borderWidth: 1,
          },
          {
            label: 'Total Pending',

            data: this.pendingOrder,
            backgroundColor: ['rgb(10,255,241, 0.2)'],
            borderColor: ['rgb(10,255,241)'],
            borderWidth: 1,
          },{
            label: 'Total Waiting Pickup',

            data: this.awaitingOrder,
            backgroundColor: ['rgb(178,10,255, 0.2)'],
            borderColor: ['rgb(178,10,255)'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}



