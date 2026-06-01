import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';

@Component({
  selector: 'app-chat-header',
  standalone: true,
  imports: [
    CommonModule,
    AvatarComponent
  ],
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.scss'
})
export class ChatHeaderComponent {

  @Input() conversation: any;
  @Input() currentUserId: string = '';
  @Input() typingUser: string = '';

  @Output() audioCall = new EventEmitter<void>();
  @Output() videoCall = new EventEmitter<void>();

  @Output() groupInfo = new EventEmitter<void>();
  @Output() addMembers = new EventEmitter<void>();
  @Output() media = new EventEmitter<void>();
  @Output() muteChat = new EventEmitter<void>();
  @Output() exitGroup = new EventEmitter<void>();

  @Output() viewProfile = new EventEmitter<void>();
  @Output() searchMessages = new EventEmitter<void>();
  @Output() blockUser = new EventEmitter<void>();

  menuOpen = false;
  activeMenuItem: string = '';

  getOtherUser() {
    return this.conversation?.participants?.find(
      (p: any) => p?.user?._id !== this.currentUserId
    )?.user;
  }

  setMenu(item: string) {
    this.activeMenuItem = item;
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

}