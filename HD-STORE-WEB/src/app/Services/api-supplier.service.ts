import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiSupplierService {
  private baseURL = 'http://localhost:5080/api/Supplier/';

  private lstSupplierSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  lstSupplier$: Observable<any[]> = this.lstSupplierSubject.asObservable();
  private localStorageKey = 'lstSupplier'; // Key for localStorage

  constructor(private http: HttpClient) {
    const storedsupplier = localStorage.getItem(this.localStorageKey);
    let initiaSupplier = [];
    if (storedsupplier) {
      initiaSupplier = JSON.parse(storedsupplier);
    }
    this.setLstSupplier(initiaSupplier);
  }

  getLstSupplier(): Observable<any[]> {
    return this.lstSupplier$;
  }

  setLstSupplier(data: any[]): void {
    this.lstSupplierSubject.next(data);
    localStorage.setItem(this.localStorageKey, JSON.stringify(data));
  }


  getNumberSuppliers(){
    return this.http.get<any>(`${this.baseURL}number_suppliers`);
  }

  getAllSupplier() :Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${this.baseURL}getAll`, {headers});
  }

  getAllSupplierWithStatusYes() :Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${this.baseURL}getAllSupplierWithStatusYes`, {headers});
  }

  getId(name:string) : Observable<any>{
    const params = new HttpParams()
    .set('supplier_name', name);

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${this.baseURL}supplier_name`, {headers, params});
  }

  getSupplierById(id:any) : Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(this.baseURL + id, {headers});
  }

  addSupplier(obj:any){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(this.baseURL, obj, {headers});
  }

  updateSupplier(obj:any){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json');

    const body = JSON.stringify({
      supplier_id: obj.supplier_id,
      supplier_name: obj.supplier_name,
      supplier_email: obj.supplier_email,
      supplier_address: obj.supplier_address,
      supplier_phone: obj.supplier_phone,
      supplier_status: obj.supplier_status
    });

    return this.http.put<any>(`${this.baseURL}`, body, {headers});
  }

  deleteSupplier(id:any){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.delete<any>(this.baseURL + id, {headers});
  }

  search(key:any) : Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${this.baseURL}search?key=${key}`, {headers});
  }
}
