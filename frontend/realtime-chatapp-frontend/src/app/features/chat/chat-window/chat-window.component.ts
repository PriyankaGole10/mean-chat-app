import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';

import { DatePipe } from '@angular/common';

import { MessageInputComponent }
from "../message-input/message-input.component";

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [
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

  @Output() sendMessage =
    new EventEmitter<string>();

  @ViewChild('scrollContainer')
  scrollContainer!: ElementRef;

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {

    try {

      this.scrollContainer.nativeElement.scrollTop =
      this.scrollContainer.nativeElement.scrollHeight;

    } catch (error) {}

  }

  isMine(message: any): boolean {

    return (
      message.sender === this.currentUserId
      ||
      message.sender?._id === this.currentUserId
    );

  }

  getOtherUser() {

  return this.conversation?.participants?.find(
    (p: any) => p.user._id !== this.currentUserId
  )?.user;

}

}