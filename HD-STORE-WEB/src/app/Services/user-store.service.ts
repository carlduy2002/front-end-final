import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {

  private _fullname = new BehaviorSubject<string>("");
  private _role = new BehaviorSubject<string>("");

  constructor() { }

  public getRoleFromStore(){
    return this._role.asObservable();
  }

  public setRoleForStore(role:string){
    this._role.next(role);
  }

  public getFullNameFromStore(){
    return this._fullname.asObservable();
  }

  public setFullNameForStore(fullname:string){
    this._fullname.next(fullname);
  }
}
