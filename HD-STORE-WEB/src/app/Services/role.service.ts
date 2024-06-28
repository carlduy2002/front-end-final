import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private baseUrl = 'http://localhost:5080/api/Role/';

  constructor(private http:HttpClient) { }

  getAllRoles() : Observable<any>{
    return this.http.get<any>(this.baseUrl);
  }
}
