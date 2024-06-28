import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'node_modules/chart.js';
import { ApiService } from 'src/app/Services/api.service';
import { UserStoreService } from 'src/app/Services/user-store.service';
Chart.register(...registerables);

@Component({
  selector: 'app-navbar-admin',
  templateUrl: './navbar-admin.component.html',
  styleUrls: ['./navbar-admin.component.css']
})
export class NavbarAdminComponent implements OnInit{
  role : string = "";
  fullname : string = "";
  marginLeft: number = 0;
  hideButton: string = 'none';
  showButton: string = 'block'

  constructor(
    private userStore:UserStoreService,
    private api:ApiService
  ){}

  ngOnInit(): void {
    this.userStore.getRoleFromStore().subscribe(res => {
      let roleFromToken = this.api.getRoleFromToken();
      this.role = res || roleFromToken;
    });

    this.userStore.getFullNameFromStore().subscribe(res => {
      let fullNameFromToken = this.api.getFullNameFormToken();
      this.fullname = res || fullNameFromToken;
    });

  }

  onHide(){
    this.marginLeft = -264;
    this.hideButton = 'none';
    this.showButton = 'block'
  }

  onShow(){
    this.marginLeft = 0;
    this.hideButton = 'block';
    this.showButton = 'none'
  }

  signOut(){
    this.role = "";
    this.fullname = "";
    this.userStore.setRoleForStore(this.role);
    this.api.signOut();
  }
}
