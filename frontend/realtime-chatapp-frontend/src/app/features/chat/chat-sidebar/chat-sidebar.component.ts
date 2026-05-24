import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-chat-sidebar',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './chat-sidebar.component.html',
  styleUrl: './chat-sidebar.component.scss'
})
export class ChatSidebarComponent {
  @Input() conversations: any[] = [];
  @Input() currentUserId!: string;
 
  @Input() onlineUsers: string[] = [];
  @Input() unreadCounts: any = {};

   @Output() openChat = new EventEmitter<any>();

  selectChat(chat: any) {
    this.openChat.emit(chat);
  }

  getOtherUser(conversation:any){
    return conversation.participants?.find((p:any)=> p.user._id !== this.currentUserId)?.user;
  }

  isOnline(conversation: any): boolean {
    // const otherUser = conversation.participants?.find((p: any) => p.user._id !== JSON.parse(sessionStorage.getItem('user') || '{}')._id)
    // return this.onlineUsers.includes(otherUser?.user?._id);
    const otherUser = this.getOtherUser(conversation);
    return this.onlineUsers.includes(otherUser?._id);
  }



}
