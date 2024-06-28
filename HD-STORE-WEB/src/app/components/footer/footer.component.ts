import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild, } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiCategoryService } from 'src/app/Services/api-category.service';
import { ApiService } from 'src/app/Services/api.service';
import { ShareService } from 'src/app/Services/share.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, AfterViewChecked, OnDestroy{
  @ViewChild('messageContainer') messageContainer !: ElementRef;
  messages: string[] = [];
  answers: any = [];
  newMessage: string = '';
  showChat: boolean = false;

  public lstCategory : any = [];

  private subscription!: Subscription;

  constructor(
    private api:ApiService,
    private apiCategory:ApiCategoryService,
    private shareService: ShareService,
    private route:Router
  ){this.subscription = this.shareService.testFunctionTriggered$.subscribe(() => {
    this.getCategory();
  });}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  callTest(): void {
    this.shareService.triggerLoad();
  }

  ngOnInit(): void {
    this.getCategory();
  }

  getCategory(){
    this.apiCategory.getCategoryUsed().subscribe(data => {
      this.lstCategory = data;
    })
  }

  searchByCategory(categoryName:any){
    this.route.navigate(['/view-product-category', categoryName]);
  }

  openChat() {
    this.showChat = true;
  }

  closeChat() {
    this.showChat = false;
  }

  sendMessage() {
    if (this.newMessage.trim() !== '') {
      this.answers.push("You: " + this.newMessage);
      this.api.chat(this.newMessage).subscribe(data => {
        const content = data.value.replace('. ', '<br>')
        this.answers.push(content);

        // console.log(this.answers);
      });
      this.scrollToBottom();
      this.newMessage = '';
    }
  }

  scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  ngAfterViewChecked() {
    this.scrollToBottom(); // Call scrollToBottom after view is checked
  }
}
