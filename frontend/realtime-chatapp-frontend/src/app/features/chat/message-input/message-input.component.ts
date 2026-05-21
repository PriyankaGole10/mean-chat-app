import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { SocketService } from '../../../core/services/socket.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.scss'
})
export class MessageInputComponent {
  @Output() send = new EventEmitter<string>();
  @Input() conversationId=''
  @Input() userId=''
  socketSer = inject(SocketService);

  // conversationId: string = ''
  // userId: string = ''
  text: string = '';

  sendMessage() {
    if (!this.text.trim()) return;

    this.send.emit(this.text);
    this.text = '';

    this.socketSer.stopTyping({
      conversationId:this.conversationId
    })
  }

  onTyping(){
    this.socketSer.typing({
      conversationId:this.conversationId,
      userId : this.userId
    })
  }

  handleKey(event:KeyboardEvent){
    if(event.key === 'Enter'){
      this.sendMessage();
    }
  }


}
