import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { UserStoreService } from './Services/user-store.service';
import { ApiService } from './Services/api.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'HD-Shoe Store';
  role : string = "";
  marginLeft: number = 0;
  hideButton: string = 'none';
  showButton: string = 'block'
  isShow: boolean = false;
  private broadcastChannel!: BroadcastChannel;

  isDevToolsOpened : boolean = false;

  constructor(
    private userStore:UserStoreService,
    private api:ApiService,
    private router: Router,
  ){this.broadcastChannel = new BroadcastChannel('auth_channel');}

  ngOnInit(): void {
    this.detectDevTools();

    // this.checkDevTools();
    // if(this.isDevToolsOpened){
    //   window.location.reload();
    // }

    this.broadcastChannel.onmessage = (event) => {
      if (event.data === 'reload') {
        if (window.location.href.startsWith('http://localhost:4200')) {
          window.location.reload();
        }
      }
    };

    this.userStore.getRoleFromStore().subscribe(res => {
      let roleFromToken = this.api.getRoleFromToken();
      this.role = res || roleFromToken;
    });
  }

  ngOnDestroy() {
    this.broadcastChannel.close();
  }

  @HostListener('document:contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    event.preventDefault(); // Prevent right-click menu
  }


  // checkDevTools() : void {
  //   const widthThreshold = 200;
  //   const check = () => {
  //     this.isDevToolsOpened = window.outerWidth - window.innerWidth > widthThreshold;
  //   };
  //   check();
  //   window.addEventListener('resize', check);
  //   setInterval(check, 1000);
  // }



  detectDevTools() {
    setInterval(() => {
      if (window.outerWidth - window.innerWidth > 100 || window.outerHeight - window.innerHeight > 100) {
        // DevTools are open
        // this.handleDevToolsOpen();
        // window.location.reload();
      }
    }, 1000);
  }

  // handleDevToolsOpen() {
  //   // Perform actions when DevTools are detected
  //   console.log("Developer Tools are open!");
  //   window.location.reload(); // Redirect to a different page
  // }

  isLoginPage(): boolean {
    return this.router.url.includes('login') || this.router.url.includes('register');
    //  || this.router.url.includes('check-old-password') || this.router.url.includes('change-password');
  }
}
