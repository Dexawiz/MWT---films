import { Component, inject, OnDestroy, signal } from '@angular/core';
import { MaterialModule } from '../../modules/material-module';
import { ChatMessage, ChatService } from '../../services/chat-service';
import { FormsModule } from '@angular/forms';
import {MatListModule} from '@angular/material/list';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  imports: [MaterialModule, FormsModule, MatListModule],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class Chat implements OnDestroy {
  chatService = inject(ChatService);
  nickName = '';
  messages = signal<ChatMessage[]>([]);
  msgToSend = '';
  greetingsSubscription?: Subscription;
  messagesSubscription?: Subscription;
  connected = signal<boolean>(false);

  onConnect() {
    this.chatService.connect().subscribe(success => {
      if (success) {
        this.connected.set(true);
        console.log('sending name', this.nickName);
        this.chatService.sendHello(this.nickName);
        this.greetingsSubscription = 
          this.chatService.listenGreetings().subscribe(greetingMsg => {
            this.messages.update(old => [new ChatMessage('server', greetingMsg), ...old]);
          });
        this.messagesSubscription =
          this.chatService.listenMessages().subscribe(chatMsg => {
            this.messages.update(old => [chatMsg, ...old]);          
          });
      }
    });
  }

  onSend() {
    this.chatService.sendMessage(this.msgToSend);
  }

  disconnect() {
    this.chatService.disconnect();
    this.greetingsSubscription?.unsubscribe();
    this.messagesSubscription?.unsubscribe();
    this.connected.set(false);
  }

  ngOnDestroy(): void {
    if (this.connected())
      this.disconnect();  
  }
}
