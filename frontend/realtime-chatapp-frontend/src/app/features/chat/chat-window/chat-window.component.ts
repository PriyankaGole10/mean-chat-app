import {
  CommonModule,
  DatePipe
} from '@angular/common';

import {
  AfterViewChecked,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild
} from '@angular/core';

// import { MessageInputComponent }
//   from '../message-input/message-input.component';
import { AvatarComponent } from "../../../shared/components/avatar/avatar.component";
import { ChatHeaderComponent } from "./chat-header/chat-header.component";
import { ProfileSidebarComponent } from './profile-sidebar/profile-sidebar.component';
import { SocketService } from '../../../core/services/socket.service';
import { UserService } from '../../../core/services/user.service';
import { MediadetailsSidebarComponent } from "./mediadetails-sidebar/mediadetails-sidebar.component";
import { MessageInputComponent } from './message-input/message-input.component';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MessageInputComponent,
    AvatarComponent,
    ChatHeaderComponent,
    ProfileSidebarComponent,
    MediadetailsSidebarComponent
],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.scss'
})
export class ChatWindowComponent implements AfterViewChecked {

  private socketSer = inject(SocketService)
  private userService = inject(UserService)
  @Input() conversation: any;
  @Input() messages: any[] = [];
  @Input() currentUserId = '';
  @Input() currentUser: any;
  @Input() typingUser = '';

  @Output() sendMessage = new EventEmitter<FormData>();
  @Output() typing = new EventEmitter<any>();
  @Output() openGroupInfo = new EventEmitter<any>();

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  isProfileOpen = false;
  selectedConversationOtherUser: any = null;
  searchQuery = '';
  isBlocked = false;
  isMuted = false;
  mediaFiles: any[] = [];
  isMediaOpen = false;




  todayDate = new Date().toLocaleDateString('en-GB');

  yesterdayDate = new Date(
    new Date().setDate(new Date().getDate() - 1)
  ).toLocaleDateString('en-GB');



  ngOnInit(): void {
    this.isBlocked = this.currentUser?.blockedUsers?.includes(
      this.getOtherUser()?._id)

    this.isMuted = this.conversation?.muteUsers?.includes(
      this.currentUserId)

    this.socketSer.onMediaResponse((data: any) => {
      if (data.conversationId === this.conversation?._id) {
        this.mediaFiles = data.media;
        this.isMediaOpen = true;
      }
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }


  scrollToBottom() {
    try {
      const el = this.scrollContainer?.nativeElement;
      if (!el) return;

      el.scrollTo({
        top: el.scrollHeight,
        behavior: 'smooth'
      });
    } catch { }
  }

  openGroupDetails() {

    if (!this.conversation?.isGroup) {
      return;
    }

    this.openGroupInfo.emit(
      this.conversation
    );

  }

 
  trackMessage(index: number, message: any) {
    return message?._id ?? index;
  }

  trackMedia(index: number, media: any) {
    return media?.fileUrl ?? index;
  }

  
  onTyping(data: any) {
    this.typing.emit(data);
  }


  isMine(message: any): boolean {
    if (!message) return false;

    return (
      message?.sender === this.currentUserId ||
      message?.sender?._id === this.currentUserId
    );
  }

  getOtherUser() {
    return this.conversation?.participants?.find(
      (p: any) => p?.user?._id !== this.currentUserId
    )?.user;
  }

  openFile(url: string) {
    if (!url) return;
    window.open(url, '_blank');
  }

  getDownloadUrl(media: any) {
    if (!media?.fileUrl) return '';

    const url = media.fileUrl;

    if (
      media.resourceType === 'raw' ||
      url.includes('/raw/upload/')
    ) {
      return url.replace(
        '/raw/upload/',
        '/raw/upload/fl_attachment/'
      );
    }

    if (
      media.resourceType === 'video' ||
      url.includes('/video/upload/')
    ) {
      return url.replace(
        '/video/upload/',
        '/video/upload/fl_attachment/'
      );
    }

    return url.replace(
      '/image/upload/',
      '/image/upload/fl_attachment/'
    );
  }

  formatBytes(bytes: number) {
    if (!bytes) return '';

    const sizes = ['Bytes', 'KB', 'MB', 'GB'];

    const i = Math.floor(
      Math.log(bytes) / Math.log(1024)
    );

    return (
      (bytes / Math.pow(1024, i)).toFixed(1) +
      ' ' +
      sizes[i]
    );
  }


  startAudioCall() {
    console.log("Audio call started");
    // later: socket + WebRTC
  }

  startVideoCall() {
    console.log("Video call started");
  }



  openAddMembers() {
    console.log("Open add members modal");
  }

  openMedia() {
    const conversationId = this.conversation?._id;

    this.socketSer.requestMedia({
      conversationId
    });
  }



  exitGroup() {
    console.log("Exit group API call");
  }

  openUserProfile() {
    this.selectedConversationOtherUser = this.getOtherUser();
    this.isProfileOpen = true;
  }

  closeProfile() {
    this.isProfileOpen = false;
  }

  openSearch(query: string) {
    const conversationId = this.conversation?._id;

    if (!conversationId || !query) return;

    this.socketSer.searchMessages({
      conversationId,
      query
    });
  }
  getHighlightedText(text: string): string {

    if (!text || !this.searchQuery) {
      return text;
    }

    const regex = new RegExp(
      `(${this.searchQuery})`,
      'gi'
    );

    return text.replace(
      regex,
      '<span class="search-highlight">$1</span>'
    );
  }

  toggleBlockUser() {
    this.selectedConversationOtherUser = this.getOtherUser();
    const blockerId = this.currentUserId;
    const blockedId = this.selectedConversationOtherUser?._id;


    if (!blockerId || !blockedId) return;

    if (this.isBlocked) {

      this.socketSer.unblockUser({
        blockerId,
        blockedId
      });

      this.isBlocked = false;
      this.userService.isBlocked.next(false)

    } else {

      this.socketSer.blockUser({
        blockerId,
        blockedId
      });

      this.isBlocked = true;
      this.userService.isBlocked.next(true)

    }
  }

  toggleMuteConversation() {

    const userId = this.currentUserId;
    const conversationId = this.conversation?._id;

    if (!userId || !conversationId) return;

    if (this.isMuted) {

      this.socketSer.unmuteConversation({
        userId,
        conversationId
      });

      this.isMuted = false;
      this.userService.isMute.next(false);

    } else {
      this.socketSer.muteConversation({
        userId,
        conversationId
      });

      this.isMuted = true;
      this.userService.isMute.next(true)

    }
  }
}