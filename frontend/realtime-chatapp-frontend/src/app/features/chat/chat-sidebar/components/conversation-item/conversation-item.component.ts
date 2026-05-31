import {
  CommonModule
} from '@angular/common';

import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { AvatarComponent } from "../../../../../shared/components/avatar/avatar.component";

@Component({
  selector: 'app-conversation-item',
  standalone: true,

  imports: [
    CommonModule,
    AvatarComponent
],

  templateUrl:
    './conversation-item.component.html',

  styleUrl:
    './conversation-item.component.scss'
})
export class ConversationItemComponent {

  @Input()
  conversation: any;

  @Input()
  currentUserId = '';

  @Input()
  onlineUsers: string[] = [];

  @Input()
  unreadCounts: any = {};

  @Input()
  selectedConversationId = '';

  @Output()
  openChat =
    new EventEmitter<any>();


  selectChat() {

    this.openChat.emit(
      this.conversation
    );

  }

  isActive() {

    return (
      this.selectedConversationId ===
      this.conversation?._id
    );

  }

  getUnreadCount() {

    return (
      this.unreadCounts?.[
        this.conversation?._id
      ] || 0
    );

  }

  getConversationName() {

    if (
      this.conversation?.isGroup
    ) {

      return (
        this.conversation?.groupName ||
        'Group'
      );

    }

    return (
      this.conversation?.participants?.find(
        (p: any) =>
          p.user._id !== this.currentUserId
      )?.user?.username || 'User'
    );
  }

  getOtherUser() {

    return this.conversation?.participants?.find(
      (p: any) =>
        p.user._id !== this.currentUserId
    )?.user;

  }

  isOnline() {

    if (
      this.conversation?.isGroup
    ) {
      return false;
    }

    return this.onlineUsers.includes(
      this.getOtherUser()?._id
    );

  }

  getLastMessagePreview() {

    const msg =
      this.conversation?.lastMessage;

    if (!msg)
      return 'No messages yet';

    if (msg.text)
      return msg.text;

    const media =
      msg.mediaUrls?.[0];

    if (
      media?.type?.startsWith(
        'image/'
      )
    ) {
      return '📷 Photo';
    }

    if (
      media?.type?.startsWith(
        'video/'
      )
    ) {
      return '🎥 Video';
    }

    if (
      media?.type?.startsWith(
        'audio/'
      )
    ) {
      return '🎵 Audio';
    }

    if (
      msg.mediaUrls?.length
    ) {
      return '📎 File';
    }

    return 'Message';

  }

  formatTime() {

    const date =

      this.conversation?.lastMessage?.createdAt ||

      this.conversation?.lastActivity;

    if (!date)
      return '';

    const msgDate =
      new Date(date);

    const today =
      new Date();

    const isToday =

      msgDate.toDateString() ===
      today.toDateString();

    if (isToday) {

      return msgDate.toLocaleTimeString(
        [],
        {
          hour: '2-digit',
          minute: '2-digit'
        }
      );

    }

    const yesterday =
      new Date();

    yesterday.setDate(
      today.getDate() - 1
    );

    const isYesterday =

      msgDate.toDateString() ===
      yesterday.toDateString();

    if (isYesterday)
      return 'Yesterday';

    return msgDate.toLocaleDateString(
      [],
      {
        day: '2-digit',
        month: 'short'
      }
    );

  }

}