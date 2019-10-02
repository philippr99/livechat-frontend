import { ChatMessageType } from './../_types/chatMessageType';
import { GraphqlService } from './../_services/graphql.service';
import { AppComponent } from './../app.component';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  messageContent: string = ""
  messages: ChatMessageType[] = [];
 
  constructor(
    private appComponent: AppComponent,
    private graphqlService: GraphqlService,
    private router: Router) { 
        if(this.appComponent.currentUser == null) {
        this.router.navigate(['/login']);
      }
    }

  ngOnInit() {
    // display old messages
    this.graphqlService.getPastMessages()
      .subscribe(res => {
        console.log(res.data);
        let oldMessages: ChatMessageType[] = (res.data['messages'] as ChatMessageType[]);
        oldMessages.forEach(message => {
          this.messages.push(message);
        })
      });
    
    // display new messages
    this.graphqlService.subscribeMessages() 
    .subscribe(res => {
      let receivedMessage: ChatMessageType = (res.data['messageReceived'] as ChatMessageType);
      this.messages.push(receivedMessage);

      setTimeout(this.updateScroll,1000);
    });
  }

   public onMessageSend() {
     this.graphqlService.sendMessage(this.messageContent)
     .subscribe(res => {
       this.messageContent = "";
     });
   }

   private updateScroll(){
    var element = document.getElementById("messageContainer");
    element.scrollTop = element.scrollHeight;
  }

  public epochToDateString(epoch){
    var time = new Date(0);
    time.setUTCSeconds(epoch);
    return `${time.getHours().toLocaleString('en-US', {minimumIntegerDigits: 2})}:${time.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2})}`;
  }
}
