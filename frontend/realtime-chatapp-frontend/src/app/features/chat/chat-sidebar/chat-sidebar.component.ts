import {
  CommonModule,
  DatePipe
} from '@angular/common';

import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-chat-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
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
  @Output() createChat = new EventEmitter<any>();
  @Output() createGroup = new EventEmitter<any>();

  searchText = '';
  searchTimeout: any;
  searchedUsers: any[] = [];

  showGroupModal = false;
  allUsers: any[] = [];
  groupName = '';
  selectedGroupUsers: any[] = [];

  private userSer = inject(UserService);

  // ===================== CHAT SELECT
  selectChat(chat: any) {
    this.openChat.emit(chat);
  }

  startChat(user: any) {
    this.createChat.emit(user);
    this.searchText = '';
    this.searchedUsers = [];
  }

  // ===================== SEARCH
  onSearch() {
    clearTimeout(this.searchTimeout);

    this.searchTimeout = setTimeout(() => {

      if (!this.searchText.trim()) {
        this.searchedUsers = [];
        return;
      }

      this.userSer.searchUsers(this.searchText).subscribe({
        next: (res) => this.searchedUsers = res,
        error: (err) => console.error(err)
      });

    }, 400);
  }

  // ===================== GROUP
  openGroupModal() {
    this.showGroupModal = true;
    this.getAllUsers();
  }

  getAllUsers() {
    this.userSer.getAllUsers().subscribe({
      next: (res: any) => this.allUsers = res,
      error: (err) => console.error(err)
    });
  }

  closeGroupModal() {
    this.showGroupModal = false;
    this.groupName = '';
    this.selectedGroupUsers = [];
  }

  toggleGroupUser(user: any) {

    const exists = this.selectedGroupUsers.find(u => u._id === user._id);

    if (exists) {
      this.selectedGroupUsers =
        this.selectedGroupUsers.filter(u => u._id !== user._id);
    } else {
      this.selectedGroupUsers.push(user);
    }
  }

  isSelectedUser(user: any) {
    return this.selectedGroupUsers.some(u => u._id === user._id);
  }

  submitCreateGroup() {

    if (!this.groupName.trim()) return alert('Enter group name');

    if (this.selectedGroupUsers.length < 2)
      return alert('Select at least 2 users');

    this.createGroup.emit({
      groupName: this.groupName,
      participants: this.selectedGroupUsers.map(u => u._id)
    });

    this.closeGroupModal();
  }

  // ===================== NAME
  getConversationName(conversation: any) {

    if (conversation.isGroup) {
      return conversation.groupName || 'Group';
    }

    return conversation.participants?.find(
      (p: any) => p.user._id !== this.currentUserId
    )?.user?.username || 'User';
  }

  isOnline(conversation: any): boolean {

    if (conversation.isGroup) return false;

    const other = conversation.participants?.find(
      (p: any) => p.user._id !== this.currentUserId
    )?.user;

    return this.onlineUsers.includes(other?._id);
  }

  // ===================== ⭐ IMPORTANT FIX (LAST MESSAGE)
  getLastMessagePreview(conversation: any): string {

    const msg = conversation?.lastMessage;

    if (!msg) return 'No messages yet';

    if (msg.text) return msg.text;

    const media = msg.mediaUrls?.[0];

    if (media?.type?.startsWith('image/')) return '📷 Photo';
    if (media?.type?.startsWith('video/')) return '🎥 Video';
    if (media?.type?.startsWith('audio/')) return '🎵 Audio';

    if (msg.mediaUrls?.length) return '📎 File';

    return 'Message';
  }


 formatLastMessageTime(date: string | Date | undefined) {
  if (!date) return '';

  const msgDate = new Date(date);
  if (isNaN(msgDate.getTime())) return '';

  const today = new Date();

  const isToday =
    msgDate.toDateString() === today.toDateString();

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isYesterday =
    msgDate.toDateString() === yesterday.toDateString();

  if (isToday) {
    return msgDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  if (isYesterday) return 'Yesterday';

  return msgDate.toLocaleDateString([], {
    day: '2-digit',
    month: 'short'
  });
}

}