import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';

import {
  CommonModule,
  DatePipe
} from '@angular/common';

import { MessageInputComponent }
from '../message-input/message-input.component';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MessageInputComponent
  ],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.scss'
})

export class ChatWindowComponent {

  @Input() conversation: any;

  @Input() messages: any[] = [];

  @Input() currentUserId: string = '';

  @Input() typingUser: string = '';

  @Output() sendMessage =
    new EventEmitter<FormData>();

  @ViewChild('scrollContainer')
  scrollContainer!: ElementRef;

  ngAfterViewChecked(){

    this.scrollToBottom();

  }

  scrollToBottom(){

    try{

      this.scrollContainer.nativeElement.scrollTop =
      this.scrollContainer.nativeElement.scrollHeight;

    }catch(error){}

  }

  isMine(message:any):boolean{

    return (
      message.sender === this.currentUserId
      ||
      message.sender?._id === this.currentUserId
    );

  }

  getOtherUser(){

    return this.conversation?.participants?.find(
      (p:any) => p.user._id !== this.currentUserId
    )?.user;

  }

 getDownloadUrl(media: any) {

  if (!media?.fileUrl) return '';

  const url = media.fileUrl;

  if (media.resourceType === 'raw' || url.includes('/raw/upload/')) {
    return url.replace('/raw/upload/', '/raw/upload/fl_attachment/');
  }

  if (media.resourceType === 'video' || url.includes('/video/upload/')) {
    return url.replace('/video/upload/', '/video/upload/fl_attachment/');
  }

  return url.replace('/image/upload/', '/image/upload/fl_attachment/');
}

  openFile(url:string){

    window.open(url, '_blank');

  }

  formatBytes(bytes:number){

    if(!bytes) return '';

    const sizes = [
      'Bytes',
      'KB',
      'MB',
      'GB'
    ];

    const i = Math.floor(
      Math.log(bytes) / Math.log(1024)
    );

    return (
      (bytes / Math.pow(1024, i)).toFixed(1)
      + ' ' +
      sizes[i]
    );

  }

}