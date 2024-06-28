import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiCartService {

  private baseURL = 'http://localhost:5080/api/CartDetail/';

  constructor(private http:HttpClient) { }

  addCart(obj:any){
    return this.http.post<any>(this.baseURL, obj);
  }

  getCart(id:any) : Observable<any>{
    const params = new HttpParams()
    .set('id', id);

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${this.baseURL}GetCart`, {params, headers});
  }

  // GetCartDetail(id:any) : Observable<any>{
  //   const params = new HttpParams()
  //   .set('id', id);

  //   return this.http.get<any>(`${this.baseURL}GetCartDetail`, {params});
  // }

  setIsCheck(formData:FormData){

    return this.http.put<any>(`${this.baseURL}setIsCheck`, formData);
  }

  getCartId(fullname:string) : Observable<any>{
    const params = new HttpParams()
    .set('fullname', fullname);

    return this.http.get<any>(`${this.baseURL}GetCartId`, {params});
  }


  deleteCart(id:any){

    return this.http.delete<any>(this.baseURL + id);
  }

  plusQty(id:any){
    const params = new HttpParams()
    .set('id', id);

    return this.http.post<any>(`${this.baseURL}plusQty`, {}, {params});
  }

  minusQty(id:any){
    const params = new HttpParams()
    .set('id', id);

    return this.http.post<any>(`${this.baseURL}minusQty`, {}, {params});
  }

  getProduct(proName: string, proSize:number) : Observable<any>{
    const params = new HttpParams()
    .set('proname', proName)
    .set('size', proSize);

    return this.http.get<any>(`${this.baseURL}GetProduct`, {params});
  }
}
