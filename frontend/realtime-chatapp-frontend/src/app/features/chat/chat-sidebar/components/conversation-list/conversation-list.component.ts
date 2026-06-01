import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-conversation-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './conversation-list.component.html',
  styleUrl: './conversation-list.component.scss'
})
export class ConversationListComponent {

  @Input() conversations: any[] = [];
  @Input() selectedConversationId = '';
  @Input() unreadCounts: any = {};
  @Input() currentUserId = '';
  @Input() onlineUsers: string[] = [];

  @Output() openChat = new EventEmitter<any>();

  ngOnInit(){
  }

  selectConversation(conv: any) {
    this.openChat.emit(conv);
  }

  isActive(conv: any): boolean {
    return this.selectedConversationId === conv?._id;
  }

  getUnreadCount(conv: any): number {
    return this.unreadCounts?.[conv._id] || 0;
  }

  getName(conv: any): string {

    // console.log('currentUserId',this.currentUserId)
    // console.log('participants',conv.participants)
    if (conv.isGroup) return conv.groupName || 'Group';

    return conv.participants?.find(
      (p: any) => p.user._id !== this.currentUserId
    )?.user?.username || 'User';
  }

  getLastMessage(conv: any): string {
    const msg = conv?.lastMessage;
    if (!msg) return 'No messages yet';

    if (msg.text) return msg.text;
    if (msg.mediaUrls?.length) return '📎 Media';

    return 'Message';
  }

  getTime(conv: any): string {
    const date = conv?.lastMessage?.createdAt || conv?.lastActivity;
    if (!date) return '';

    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  isOnline(conv: any): boolean {
    if (conv.isGroup) return false;

    const userId = conv.participants?.find(
      (p: any) => p.user._id !== this.currentUserId
    )?.user?._id;

    return this.onlineUsers.includes(userId);
  }
}