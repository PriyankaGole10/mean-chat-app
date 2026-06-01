import {
  CommonModule,
  DatePipe
} from '@angular/common';

import {
  AfterViewChecked,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';

import { MessageInputComponent }
  from '../message-input/message-input.component';
import { AvatarComponent } from "../../../shared/components/avatar/avatar.component";
import { ChatHeaderComponent } from "./chat-header/chat-header.component";
import { ProfileSidebarComponent } from './profile-sidebar/profile-sidebar.component';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MessageInputComponent,
    AvatarComponent,
    ChatHeaderComponent,
    ProfileSidebarComponent
  ],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.scss'
})
export class ChatWindowComponent implements AfterViewChecked {

  @Input() conversation: any;
  @Input() messages: any[] = [];
  @Input() currentUserId = '';
  @Input() typingUser = '';

  @Output() sendMessage = new EventEmitter<FormData>();
  @Output() typing = new EventEmitter<any>();
  @Output() openGroupInfo = new EventEmitter<any>();

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  isProfileOpen = false;
  selectedUser: any = null;


  todayDate = new Date().toLocaleDateString('en-GB');

  yesterdayDate = new Date(
    new Date().setDate(new Date().getDate() - 1)
  ).toLocaleDateString('en-GB');


  ngOnInit():void{
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

  // =========================
  // TRACK BY (FIXED SAFELY)
  // =========================
  trackMessage(index: number, message: any) {
    return message?._id ?? index;
  }

  trackMedia(index: number, media: any) {
    return media?.fileUrl ?? index;
  }

  // =========================
  // EVENTS
  // =========================
  onTyping(data: any) {
    this.typing.emit(data);
  }

  // =========================
  // HELPERS
  // =========================
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
    console.log("Open media gallery");
  }

  muteConversation() {
    console.log("Mute chat API call");
  }

  exitGroup() {
    console.log("Exit group API call");
  }

  openUserProfile() {
    this.selectedUser = this.getOtherUser();
    this.isProfileOpen = true;
  }

  closeProfile() {
    this.isProfileOpen = false;
  }

  openSearch() {
    console.log("Open message search UI");
  }

  blockUser() {
    console.log("Block user API call");
  }
}