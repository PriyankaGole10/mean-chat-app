import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { SocketService } from '../../../core/services/socket.service';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule
  ],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.scss'
})
export class MessageInputComponent {

  @Output() send = new EventEmitter<any>();

  @Input() conversationId = '';

  @Input() userId = '';

  private socketSer = inject(SocketService);

  text: string = '';

  selectedFiles: File[] = [];

  typingTimeout: any;

  // FILE SELECT

  onFileSelected(event: any) {

    const files = Array.from(
      event.target.files || []
    ) as File[];

    this.selectedFiles = [
      ...this.selectedFiles,
      ...files
    ];

  }

  // IMAGE PREVIEW

  getFilePreview(file: File) {

    return URL.createObjectURL(file);

  }

  isImageFile(file: File): boolean {

  if (!file) return false;

  const imageExtensions =
    ['jpg', 'jpeg', 'png', 'gif', 'webp'];

  const fileName =
    file.name?.toLowerCase() || '';

  const hasImageExtension =
    imageExtensions.some(ext =>
      fileName.endsWith('.' + ext)
    );

  return (
    file?.type?.startsWith('image/')
    ||
    hasImageExtension
  );

}

  // REMOVE FILE

  removeFile(file: File) {

    this.selectedFiles =
      this.selectedFiles.filter(
        f => f !== file
      );

  }

  // TYPING

  onTyping() {

    this.socketSer.typing({
      conversationId: this.conversationId,
      userId: this.userId
    });

    clearTimeout(this.typingTimeout);

    this.typingTimeout = setTimeout(() => {

      this.socketSer.stopTyping({
        conversationId: this.conversationId,
        userId: this.userId
      });

    }, 1000);

  }

  // SEND MESSAGE

  sendMessage() {

    if (
      !this.text.trim()
      &&
      this.selectedFiles.length === 0
    ) return;

    const formData = new FormData();

    formData.append(
      'conversationId',
      this.conversationId
    );

    formData.append(
      'text',
      this.text
    );

    let messageType = 'text';

    // FILES

    if(this.selectedFiles.length){

      this.selectedFiles.forEach(
        (file: File) => {

          formData.append(
            'files',
            file
          );

        }
      );

      const firstFile =
        this.selectedFiles[0];

      if(
        firstFile?.type?.startsWith('image/')
        ||
        firstFile?.name?.match(
          /\.(jpg|jpeg|png|gif|webp)$/i
        )
      ){

        messageType = 'image';

      } else if(
        firstFile?.type === 'application/pdf'
      ){

        messageType = 'pdf';

      } else if(
        firstFile?.type?.startsWith('video/')
      ){

        messageType = 'video';

      } else if(
        firstFile?.type?.startsWith('audio/')
      ){

        messageType = 'audio';

      } else {

        messageType = 'file';

      }

    }

    formData.append(
      'messageType',
      messageType
    );

    // SEND TO PARENT

    this.send.emit(formData);

    // RESET

    this.text = '';

    this.selectedFiles = [];

    // STOP TYPING

    this.socketSer.stopTyping({
      conversationId: this.conversationId,
      userId: this.userId
    });

  }

}