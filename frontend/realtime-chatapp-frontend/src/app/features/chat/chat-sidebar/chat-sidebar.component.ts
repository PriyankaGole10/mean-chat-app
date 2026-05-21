import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-chat-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './chat-sidebar.component.html',
  styleUrl: './chat-sidebar.component.scss'
})
export class ChatSidebarComponent {
@Input() conversations: any[] = [];
@Output() openChat = new EventEmitter<any>();

selectChat(chat: any) {
  this.openChat.emit(chat);
}
}
