import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { param } from 'jquery';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiOrderService {
  private baseURL = 'http://localhost:5080/api/Order/';
  private APIOrderDetail = 'http://localhost:5080/api/OrderDetail/';


  private lstOrderSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  lstOrder$: Observable<any[]> = this.lstOrderSubject.asObservable();
  private localStorageKey = 'lstOrder'; // Key for localStorage

  constructor(private http: HttpClient) {
    const storedOrder = localStorage.getItem(this.localStorageKey);
    let initialOrder = [];
    if (storedOrder) {
      initialOrder = JSON.parse(storedOrder);
    }
    this.setLstOrder(initialOrder);
  }

  getLstOrder(): Observable<any[]> {
    return this.lstOrder$;
  }

  setLstOrder(data: any[]): void {
    this.lstOrderSubject.next(data);
    localStorage.setItem(this.localStorageKey, JSON.stringify(data));
  }

  addOrder(CartObj:any, OrderObj:any){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const body = {
      cart: CartObj,
      order: OrderObj,
    };

    return this.http.post<any>(`${this.baseURL}`, body, {headers});
  }

  ReOrder(OrderObj:any){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(`${this.baseURL}Reorder`, OrderObj, {headers});
  }

  getAllOrder() : Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(this.baseURL, {headers});
  }

  getOrderHistory(username:string) : Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${this.baseURL}get_order_history?username=${username}`, {headers});
  }

  getOrderDetail(id:number) : Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${this.APIOrderDetail}view_detail?id=${id}`, {headers});
  }

  getOrderHistoryDetail(id:number) : Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${this.APIOrderDetail}view_order_history_detail`, {params: {id}, headers});
  }

  confirmOrder(id:number, confimer:string){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const params = new HttpParams()
    .set('id', id)
    .set('confimer', confimer);

    console.log(params);
    return this.http.put<any>(`${this.baseURL}ConfirmOrder`, {}, {params, headers});
  }

  rejectOrder(id:number, rejector:string){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const params = new HttpParams()
    .set('id', id)
    .set('rejector', rejector);

    console.log(params);
    return this.http.put<any>(`${this.baseURL}RejectOrder`, {}, {params, headers});
  }

  returnOrder(id:number, returner:string){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const params = new HttpParams()
    .set('id', id)
    .set('returner', returner);

    console.log(params);
    return this.http.put<any>(`${this.baseURL}ReturnOrder`, {}, {params, headers});
  }

  deliveredOrder(id:number, deliver:string){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const params = new HttpParams()
    .set('id', id)
    .set('deliver', deliver);

    console.log(params);
    return this.http.put<any>(`${this.baseURL}DeliveredOrder`, {}, {params, headers});
  }

  cancelOrder(id:number){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const params = new HttpParams()
    .set('id', id);

    return this.http.put<any>(`${this.baseURL}CancelOrder`, {}, {params, headers})
  }

  cancelOrderByAdmin(id:number, content:any, canceller:string){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const params = new HttpParams()
    .set('id', id)
    .set('content', content)
    .set('canceller', canceller);

    return this.http.put<any>(`${this.baseURL}CancelOrderByAdmin`, {}, {params, headers})
  }

  search(key:any) : Observable<any>{
    return this.http.get<any>(`${this.baseURL}search?key=${key}`);
  }
}
