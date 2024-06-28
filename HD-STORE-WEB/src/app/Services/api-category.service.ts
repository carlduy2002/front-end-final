import { param } from 'jquery';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Form } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ApiCategoryService {
  private baseURL = 'http://localhost:5080/api/Category/';

  private lstCategorySubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  lstCategory$: Observable<any[]> = this.lstCategorySubject.asObservable();
  private localStorageKey = 'lstCategory'; // Key for localStorage

  constructor(private http: HttpClient) {
    const storedCategory = localStorage.getItem(this.localStorageKey);
    let initialCategory = [];
    if (storedCategory) {
      initialCategory = JSON.parse(storedCategory);
    }
    this.setLstCategory(initialCategory);
  }

  getLstCategory(): Observable<any[]> {
    return this.lstCategory$;
  }

  setLstCategory(data: any[]): void {
    this.lstCategorySubject.next(data);
    localStorage.setItem(this.localStorageKey, JSON.stringify(data));
  }

  getNumberCategories(){
    return this.http.get<any>(`${this.baseURL}number_categories`);
  }

  getCategoryUsed() : Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(this.baseURL, {headers});
  }

  getAllCategory(): Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${this.baseURL}GetAllCategory`, {headers});
  }

  getId(name:string) : Observable<any>{
    const params = new HttpParams()
    .set('category_name', name);

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${this.baseURL}category_name`, {headers, params});
  }

  getCategoryById(id:any) : Observable<any>{
    const params = new HttpParams()
    .set('category_id', id);
    return this.http.get<any>(`${this.baseURL}category_id`, {params});
  }

  addCategory(obj:any){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(`${this.baseURL}AddCategory`, obj, {headers});
  }

  addCategoryByManager(formData:FormData){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(this.baseURL + "add_category_by_manager",formData, {headers});
  }

  deleteCategory(id:any){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.delete<any>(this.baseURL + id, {headers});
  }

  deleteCategoryByManager(formData:FormData){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(`${this.baseURL}delete_category_by_manager`, formData, {headers});
  }

  updateCategory(obj:any){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');

    const body = JSON.stringify({
      category_id: obj.c_id,
      category_name: obj.c_name,
      category_description: obj.c_description,
      category_status: obj.c_status
    });

    return this.http.put<any>(`${this.baseURL}UpdateCategoryByAdmin`, body, {headers});
  }

  updateCategoryByManager(formData:FormData){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`);

    return this.http.put<any>(`${this.baseURL}update_category_by_manager`, formData, {headers});
  }

  getProductByCategory(key:any):Observable<any>{

    return this.http.get<any>(`${this.baseURL}FindProductByCategory?categoryKey=${key}`);
  }

  confirmCategory(id:any){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const formData = new FormData();
    formData.append("category_id", id);

    return this.http.put<any>(`${this.baseURL}confirm_category`, formData, {headers})
  }

  search(key:any) : Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${this.baseURL}search?key=${key}`, {headers});
  }
}
