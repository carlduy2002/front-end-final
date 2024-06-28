import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SizeService {
  private baseUrl = 'http://localhost:5080/api/Size/';

  private lstSizeSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  lstSize$: Observable<any[]> = this.lstSizeSubject.asObservable();
  private localStorageKey = 'lstSize'; // Key for localStorage

  constructor(private http: HttpClient) {
    const storedSize = localStorage.getItem(this.localStorageKey);
    let initialSize = [];
    if (storedSize) {
      initialSize = JSON.parse(storedSize);
    }
    this.setLstSize(initialSize);
  }

  getLstSize(): Observable<any[]> {
    return this.lstSize$;
  }

  setLstSize(data: any[]): void {
    this.lstSizeSubject.next(data);
    localStorage.setItem(this.localStorageKey, JSON.stringify(data));
  }
  getAllSizes() : Observable<any>{
    return this.http.get<any>(this.baseUrl);
  }

  getSizeById(size_id:number){
    return this.http.get<any>(this.baseUrl + size_id);
  }

  getId(name:string) : Observable<any>{
    const params = new HttpParams()
    .set('size_number', name);

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${this.baseUrl}size_number`, {headers, params});
  }

  addSize(size:any){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.baseUrl}`, size, {headers});
  }

  updateSize(sizeObj:any){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json');

    const body = JSON.stringify({
      size_id: sizeObj.size_id,
      size_number: sizeObj.size_number,
    });

    return this.http.put<any>(`${this.baseUrl}`, body, {headers});
  }

  deleteSize(size_id:any){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.delete<any>(this.baseUrl + size_id, {headers});
  }
}
