import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt'
import { TokenApiModel } from '../Models/token-api.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseURL = "http://localhost:5080/api/Account/";
  PhotoUrl = "http://localhost:5080/Photos";


  private broadcastChannel!: BroadcastChannel;
  private baseURLs = 'http://127.0.0.1:8000/';

  private userPayLoad:any;

  constructor(private http:HttpClient, private router:Router)
  {
    this.broadcastChannel = new BroadcastChannel('auth_channel');
    this.userPayLoad = this.decodedToken();
  }

  chat(str:any){
    return this.http.get<any>(`${this.baseURLs}chat?question=${str}/`);
  }

  getImage() {
    return this.http.get<any>(`${this.baseURLs}compare_images/`);
  }

  sendImageToPython(formData:FormData){
    return this.http.post<any>(`${this.baseURLs}process_file`, formData);
  }

  uploadImage(file:any){
    return this.http.post<any>(`${this.baseURL}UploadImage`, file);
  }

  getUserId(username:string) : Observable<any>{
    const params = new HttpParams()
    .set('username', username);

    return this.http.get<any>(`${this.baseURL}Username`, {params});
  }

  getUserByName(user:string) : Observable<any>{
    const params = new HttpParams()
    .set('user', user);

    return this.http.get<any>(`${this.baseURL}User`, {params});
  }

  confirmOldPassword(password:any, user_id:number){
    const params = new HttpParams()
    .set('user_id', user_id)
    .set('password', password);

    return this.http.post<any>(`${this.baseURL}Password`, {}, {params});
  }

  changePassword(new_password:string, confirm_password:string, user_id:number){
    const params = new HttpParams()
    .set('newPass', new_password)
    .set('conPass', confirm_password)
    .set('user_id', user_id);

    return this.http.post<any>(`${this.baseURL}ChangePassword`, {}, {params});
  }

  banAccount(id:any){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const params = new HttpParams()
    .set('id', id);

    return this.http.post<any>(`${this.baseURL}BanAccount`,{}, {params, headers});
  }

  unbanAccount(id:any){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const params = new HttpParams()
    .set('account_id', id);

    return this.http.post<any>(`${this.baseURL}UnBanAccount`, {}, {params, headers});
  }

  login(username:string, password:string): Observable<any>{
    const params = new HttpParams()
    .set('username', username)
    .set('password', password);

    return this.http.post<any>(`${this.baseURL}Login`, {},{params});
  }

  signup(account:any) : Observable<any>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({
      account_username: account.username,
      account_email: account.email,
      account_password: account.password,
      account_confirm_password: account.confirmPassword,
      account_birthday: account.birthday,
      account_phone: account.phone,
      account_address: account.address,
      account_gender: account.gender,
      account_role_id: account.role,
      account_status: account.status
    });

    return this.http.post<any>(`${this.baseURL}Register`, body, {headers});
  }

  signOut(){
    localStorage.clear();
    this.router.navigate(['']).then(()=>{
      this.broadcastChannel.postMessage('reload');
      window.location.reload();
    });
  }

  updateProfile(formdata:FormData){
    return this.http.put<any>(`${this.baseURL}UpdateProfile`, formdata);
  }

  storeToken(tokenValue:string){
    localStorage.setItem('token', tokenValue);
  }

  storeRefreshToken(tokenValue:string){
    localStorage.setItem('refreshToken', tokenValue);
  }

  getToken(){
    return localStorage.getItem('token');
  }

  getRefreshToken(){
    return localStorage.getItem('refreshToken');
  }

  isLoggedIn():boolean{
    return !!localStorage.getItem('token');
  }

  decodedToken(){
    const jwt = new JwtHelperService();
    const token = this.getToken()!;

    // console.log(jwt.decodeToken(token));

    return jwt.decodeToken(token);
  }

  getAllAccount(): Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${this.baseURL}GetAllAccount`, {headers});
  }

  getFullNameFormToken(){
    if(this.userPayLoad){
      return this.userPayLoad.unique_name;
    }
  }

  getRoleFromToken(){
    if(this.userPayLoad){
      return this.userPayLoad.role;
    }
  }

  renewToken(tokenApi:TokenApiModel){
    return this.http.post<any>(`${this.baseURL}Refresh`, tokenApi);
  }
}
