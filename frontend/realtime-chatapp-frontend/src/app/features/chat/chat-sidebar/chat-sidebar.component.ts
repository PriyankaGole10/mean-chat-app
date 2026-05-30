import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { SearchUsersComponent } from './components/search-users/search-users.component';
import { ConversationListComponent } from './components/conversation-list/conversation-list.component';

@Component({
  selector: 'app-chat-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SearchUsersComponent,
    ConversationListComponent
  ],
  templateUrl: './chat-sidebar.component.html',
  styleUrl: './chat-sidebar.component.scss'
})
export class ChatSidebarComponent {
currentUser: any;
  @Input() conversations: any[] = [];
  @Input() currentUserId = '';
  @Input() onlineUsers: string[] = [];
  @Input() unreadCounts: any = {};
  @Input() selectedConversationId = '';

  @Output() openChat = new EventEmitter<any>();
  @Output() openGroup = new EventEmitter<void>();

  ngOnInit(){
     const user = sessionStorage.getItem('user');
       this.currentUser = user ? JSON.parse(user) : null;
       this.currentUserId =  this.currentUser._id
  }

}