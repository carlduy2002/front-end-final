import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiImageService {
  private baseURL = 'http://localhost:5080/api/Image/';


  constructor(private http:HttpClient) { }

  GetImageByProId(product_image:string) : Observable<any>{
    return this.http.get<any>(this.baseURL + product_image);
  }

  deleteImage(pro_id:number) : Observable<any>{
    return this.http.delete<any>(this.baseURL + "delete", {params: {pro_id}});
  }

}
