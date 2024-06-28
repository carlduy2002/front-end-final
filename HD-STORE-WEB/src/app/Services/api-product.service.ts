import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class ApiProductService {
  private baseURL = 'http://localhost:5080/api/Product/';
  PhotoUrl = "http://localhost:5080/Photos";
  Thumbnail = "http://localhost:5080/Thumbnail";
  Image = "http://localhost:5080/image";

  private lstProductSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  lstProduct$: Observable<any[]> = this.lstProductSubject.asObservable();
  private localStorageKey = 'lstProduct'; // Key for localStorage

  constructor(
    private http:HttpClient,
    private router:Router,
  ) {
    const storedProduct = localStorage.getItem(this.localStorageKey);
    let initialProduct = [];
    if (storedProduct) {
      initialProduct = JSON.parse(storedProduct);
    }
    this.setLstProduct(initialProduct);
   }

  getLstProduct(): Observable<any[]> {
    return this.lstProduct$;
  }

  setLstProduct(data: any[]): void {
    this.lstProductSubject.next(data);
    localStorage.setItem(this.localStorageKey, JSON.stringify(data));
  }

  getPath(path:string){
    return this.http.get<any>(`${this.baseURL}CalculateSimilarityImage`, {params : {path}});
  }

  getAllProduct() : Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(this.baseURL, {headers});
  }

  getAllProductByManager() : Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${this.baseURL}get_all_product_by_manager`, {headers});
  }

  getAllProductWithStatusYes() : Observable<any>{
    return this.http.get<any>(`${this.baseURL}GetProductWithStatus`);
  }

  getProductByImage(product_image:string) : Observable<any>{
    return this.http.get<any>(`${this.baseURL}product_image?product_image=${product_image}`);
  }

  getProductById(proId:number) : Observable<any>{
    return this.http.get<any>(`${this.baseURL}product_id?product_id=${proId}`);
  }

  getProductSize(proName:any) : Observable<any>{
    return this.http.get<any>(this.baseURL + proName + "/size");
  }

  getRelatedProduct(category_id:number, product_name:any) : Observable<any>{
    return this.http.get<any>(`${this.baseURL}category_id?category_id=${category_id}&proName=${product_name}`);
  }

  addProduct(formdata:FormData){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(`${this.baseURL}`, formdata, {headers});
  }

  addProductByManager(formdata:FormData){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(`${this.baseURL}add_new_product_by_manager`, formdata, {headers});
  }

  updateProduct(formdata:FormData){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put<any>(`${this.baseURL}`, formdata, {headers});
  }

  updateProductByManager(formdata:FormData){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put<any>(`${this.baseURL}update_product_with_role_manager`, formdata, {headers});
  }

  deleteProduct(id:any){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.delete<any>(this.baseURL + id, {headers});
  }

  deleteProductByManager(formData:FormData){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put<any>(`${this.baseURL}delete_product_by_manager`, formData, {headers});
  }

  confirmProduct(product_id:any){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const formData = new FormData();
    formData.append("product_id", product_id);

    return this.http.put<any>(`${this.baseURL}confirm_product`, formData, {headers});
  }

  uploadImage(file:any){
    return this.http.post<any>(`${this.baseURL}uploadImage`, file);
  }

  getImage():Observable<any>{
    return this.http.get<any>(`${this.baseURL}getImage`);
  }

  search(key:any):Observable<any>{
    return this.http.get<any>(`${this.baseURL}search?key=${key}`);
  }
}
