import { DatePipe } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MessageInputComponent } from "../message-input/message-input.component";

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [DatePipe, MessageInputComponent],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.scss'
})
export class ChatWindowComponent implements AfterViewChecked {

  @Input() conversation: any;
  @Input() messages: any[] = [];
  @Input() currentUserId!: string;
  @Output() send = new EventEmitter<string>();

  @ViewChild('scrollContainer') scrollcontainer!: ElementRef;

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    try {
      this.scrollcontainer.nativeElement.scrollTop = this.scrollcontainer.nativeElement.scrollHeight;
    } catch (error) {

    }
  }

  isMine(message: any): boolean {
    return (
      message.sender === this.currentUserId || message.sender?._id === this.currentUserId
    )
  }

  sendMessage(text: string) {
    this.send.emit(text);
  }

}
