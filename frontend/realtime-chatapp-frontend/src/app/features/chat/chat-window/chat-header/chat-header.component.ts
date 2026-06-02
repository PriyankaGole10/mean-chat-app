import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { SocketService } from '../../../../core/services/socket.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-header',
  standalone: true,
  imports: [
    CommonModule,
    AvatarComponent,
    FormsModule
  ],
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.scss'
})
export class ChatHeaderComponent {
  private socketService = inject(SocketService)
  @Input() conversation: any;
  @Input() currentUserId: string = '';
  @Input() typingUser: string = '';
  @Input() isBlocked = false;
  @Input() isMuted = false;

  @Output() audioCall = new EventEmitter<void>();
  @Output() videoCall = new EventEmitter<void>();

  @Output() groupInfo = new EventEmitter<void>();
  @Output() addMembers = new EventEmitter<void>();
  @Output() media = new EventEmitter<void>();
  // @Output() muteChat = new EventEmitter<void>();
  @Output() exitGroup = new EventEmitter<void>();
  @Output() toggleBlock = new EventEmitter<void>();
  @Output() toggleMute = new EventEmitter<void>();

  @Output() viewProfile = new EventEmitter<void>();
  @Output() searchMessages = new EventEmitter<string>();
  // @Output() blockUser = new EventEmitter<void>();

  menuOpen = false;
  activeMenuItem: string = '';
  searchQuery: string = '';
  searchResults: any[] = [];
  isSearchOpen = false;

  ngOnInit() {

    this.socketService.onSearchResults((data: any) => {

      if (data.conversationId === this.conversation._id) {
        this.searchResults = data.results;
      }

    });

  }


  getOtherUser() {
    return this.conversation?.participants?.find(
      (p: any) => p?.user?._id !== this.currentUserId
    )?.user;
  }

  setMenu(item: string) {
    this.activeMenuItem = item;
    if (item === 'search') {
    this.isSearchOpen = true;
  }
    this.menuOpen = false;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  openGroupInfo() {
    this.groupInfo.emit();
    this.menuOpen = false;
  }

  openAddMembers() {
    this.addMembers.emit();
    this.menuOpen = false;
  }


  onSearchTyping() {

    const query = this.searchQuery?.trim();
     this.searchMessages.emit(query);

    if (!query) {
      this.searchResults = [];
      return;
    }

    this.socketService.searchMessages({
      conversationId: this.conversation._id,
      query
    });
  }

  closeSearch() {
    this.isSearchOpen = false;
    this.searchQuery = '';
    this.searchResults = [];
  }

  scrollToMessage(messageId: string) {

    const element = document.getElementById(messageId);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('highlight');

      setTimeout(() => {
        element.classList.remove('highlight');
      }, 2000);
    }

  }

 

}