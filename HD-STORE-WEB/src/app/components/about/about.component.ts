import { Component, OnInit } from '@angular/core';
import { ApiProductService } from 'src/app/Services/api-product.service';
import { ApiService } from 'src/app/Services/api.service';
import { UserStoreService } from 'src/app/Services/user-store.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit{

  path : string = "";
  image : any = [];
  public role:string = "";

  constructor(
    private productApi:ApiProductService,
    private userStore:UserStoreService,
    private api:ApiService
  ){}

  ngOnInit(): void {
    this.getImage();

    this.userStore.getRoleFromStore().subscribe(res => {
      let roleFromToken = this.api.getRoleFromToken();
      this.role = res || roleFromToken;
    });
  }

  getImage(){
    this.path = this.productApi.Thumbnail + '/'
    this.image.push('about.png');
  }

}
