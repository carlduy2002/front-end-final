import { Injectable } from '@angular/core';
import { HttpClient } from '@microsoft/signalr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  private baseURL = 'http://127.0.0.1:8000/';

  constructor(private http:HttpClient) { }

  public lstimage = [];

  // getImage() {
  //   return this.http.get<any>(`${this.baseURL}compare_images/`);
  // }
}
