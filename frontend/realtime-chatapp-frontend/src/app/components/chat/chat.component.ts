import { Component } from '@angular/core';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  message: string = '';
  messages: any[] = [];

  constructor(private socketSer: SocketService) { }

  ngOnInit(): void {
    this.getConnectedToSocket();
    this.receiveMessage();
  }

  getConnectedToSocket() {
    this.socketSer.onconnect(() => {
      console.log('connected to socket')
    })
  }

  receiveMessage(){
    this.socketSer.receiveMessage((msg)=>{
      this.messages.push(msg)
    })
  }


  sendMessage(){
    if(!this.message.trim()) return;

    let msg = {
      text: this.message,
      sender: 'User'
    };

    this.socketSer.sendMessage(msg);
    this.message = '';
  }


}
