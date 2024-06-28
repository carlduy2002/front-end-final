import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { param } from 'jquery';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  private baseUrl = 'http://localhost:5080/api/Statistical/';

  constructor(
    private http:HttpClient
  ) { }

  getTotalOrderInYear(year:number) : Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${this.baseUrl}GetTotalOrderInYear`, {params: {year}, headers});
  }

  getTotalRevenueInMonthOfYear(month:number, year:number) : Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${this.baseUrl}TotalRevenueInMonth`, {params : {month, year}, headers});
  }

  getBestSeller(year:number) : Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${this.baseUrl}BestSale`, {params: {year}, headers});
  }

  getBestSell(year:number) : Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${this.baseUrl}BestSeller`, {params: {year}, headers});
  }

  getBestSellToShow(year:number) : Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${this.baseUrl}Top4BestSeller`, {params: {year}, headers});
  }
}
