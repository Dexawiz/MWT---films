import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import {Client, over, Subscription} from 'stompjs';
import { MessageService } from './message-service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  messageService = inject(MessageService);
  url = environment.websocketUrl;
  socket?: WebSocket;
  stompClient?: Client;
  nickName: string = '';
  greetingsSubscription?: Subscription;
  messagesSubscription?: Subscription;

  connect(): Observable<boolean> {
    return new Observable(subscriber => {
      this.socket = new WebSocket(this.url);
      this.stompClient = over(this.socket);
      this.stompClient.connect({}, frame => {
        subscriber.next(true);
        subscriber.complete();
      }, error => {
        subscriber.next(false);
        console.error('websocket cannot be open. ', error);
        this.messageService.errorMessage('Cannot connect to chat server');
        subscriber.complete();
      });
    });
  }
  disconnect() {
    this.greetingsSubscription?.unsubscribe();
    this.messagesSubscription?.unsubscribe();
    this.stompClient?.disconnect(() => {
      this.messageService.successMessage("Disconnected from chat server");
    })
    this.socket?.close();
  }

  sendHello(nick: string) {
    this.nickName = nick;
    this.stompClient?.send('/app/hello',{},JSON.stringify({name: nick}));
  }
  sendMessage(msgToSend: string) {
    const chatMessage = new ChatMessage(this.nickName, msgToSend);
    this.stompClient?.send('/app/message',{},JSON.stringify(chatMessage));
  }
  listenGreetings(): Observable<string> {
    return new Observable(subscriber => {
      this.greetingsSubscription = 
        this.stompClient?.subscribe('/topic/greetings',packet => {
          const message: string = JSON.parse(packet.body).content;
          subscriber.next(message);
        });
    })
  }
  listenMessages(): Observable<ChatMessage> {
    return new Observable(subscriber => {
      this.messagesSubscription = 
        this.stompClient?.subscribe('/topic/messages',packet => {
         const chatMessage = JSON.parse(packet.body) as ChatMessage;
         subscriber.next(chatMessage);
        });
    })
  }
}

export class ChatMessage {
  constructor(
    public name: string,
    public message: string
  ){}
}