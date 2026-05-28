import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-sidebar',
  standalone: true,
  imports: [DatePipe,CommonModule,FormsModule],
  templateUrl: './chat-sidebar.component.html',
  styleUrl: './chat-sidebar.component.scss'
})
export class ChatSidebarComponent {
  @Input() conversations: any[] = [];
  @Input() currentUserId!: string;
 

  @Input() onlineUsers: string[] = [];
  @Input() unreadCounts: any = {};

   @Input() selectedConversationId = '';

  @Output() openChat = new EventEmitter<any>();
  @Output() createChat  = new EventEmitter<any>();

  searchText = "";
  searchTimeout: any;
  searchedUsers:any[] = [];

  private userSer = inject(UserService);

  selectChat(chat: any) {
    this.openChat.emit(chat);
  }

  startChat(user:any){
  this.createChat.emit(user);
  this.searchText = '';
  this.searchedUsers = [];
}

  getOtherUser(conversation: any) {
    return conversation.participants?.find((p: any) => p.user._id !== this.currentUserId)?.user;
  }

  isOnline(conversation: any): boolean {
    // const otherUser = conversation.participants?.find((p: any) => p.user._id !== JSON.parse(sessionStorage.getItem('user') || '{}')._id)
    // return this.onlineUsers.includes(otherUser?.user?._id);
    const otherUser = this.getOtherUser(conversation);
    return this.onlineUsers.includes(otherUser?._id);
  }



  onSearch(){

    clearTimeout(this.searchTimeout);

    this.searchTimeout = setTimeout(()=>{
          if(!this.searchText.trim()){
            this.searchedUsers = [];
            return;
          }
  


    this.userSer.searchUsers(this.searchText).subscribe({
      next:(res)=>{
        this.searchedUsers = res;
      },
      error:(err)=>{
        console.error(err)
      }
    })
  

    },500)
  }



}
