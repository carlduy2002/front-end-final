import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResetPassword } from '../Models/reset-password.model';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
  private baseURL = "http://localhost:5080/api/Account/";

  constructor(private http:HttpClient) { }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  sendResetPasswordLink(email: string){
    return this.http.post<any>(`${this.baseURL}send-reset-email/${email}`, {})
  }

  resetPassword(resetPasswordObj: ResetPassword){
    return this.http.post<any>(`${this.baseURL}reset-password`, resetPasswordObj);
  }
}
