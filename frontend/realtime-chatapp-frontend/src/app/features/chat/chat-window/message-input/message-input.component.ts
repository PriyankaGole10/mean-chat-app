import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  OnDestroy
} from '@angular/core';

import { CommonModule }
from '@angular/common';

import { FormsModule }
from '@angular/forms';

import { MatIconModule }
from '@angular/material/icon';
import { SocketService } from '../../../../core/services/socket.service';

// import { SocketService }
// from '../../../core/services/socket.service';

@Component({

  selector: 'app-message-input',

  standalone: true,

  imports: [

    CommonModule,
    FormsModule,
    MatIconModule

  ],

  templateUrl:
  './message-input.component.html',

  styleUrl:
  './message-input.component.scss'

})

export class MessageInputComponent
implements OnDestroy {

  // =========================
  // OUTPUTS
  // =========================

  @Output()
  send =
  new EventEmitter<FormData>();

  // =========================
  // INPUTS
  // =========================

  @Input()
  conversationId = '';

  @Input()
  userId = '';

  // =========================
  // SERVICES
  // =========================

  private socketSer =
  inject(SocketService);

  // =========================
  // STATE
  // =========================

  text = '';

  selectedFiles:any[] = [];

  typingTimeout:any;

  // =========================
  // TRACK BY
  // =========================

  trackFile(
    index:number,
    item:any
  ){

    return (

      item?.file?.name

      +

      '_'

      +

      index

    );

  }

  // =========================
  // FILE SELECT
  // =========================

  onFileSelected(event:any){

    const files =
    Array.from(
      event?.target?.files || []
    );

    const mappedFiles =
    files.map(

      (file:any) => ({

        file,

        preview:

        file?.type?.startsWith(
          'image/'
        )

        ?

        URL.createObjectURL(file)

        :

        null

      })

    );

    this.selectedFiles = [

      ...this.selectedFiles,

      ...mappedFiles

    ];

    // RESET INPUT
    // so same file can reselect

    if(event?.target){

      event.target.value = '';

    }

  }

  // =========================
  // IMAGE CHECK
  // =========================

  isImageFile(item:any):boolean {

    const file =
    item?.file;

    if(!file)
      return false;

    return (
      file?.type?.startsWith(
        'image/'
      )
    );

  }

  // =========================
  // REMOVE FILE
  // =========================

  removeFile(item:any){

    // cleanup blob url

    if(item?.preview){

      URL.revokeObjectURL(
        item.preview
      );

    }

    this.selectedFiles =
    this.selectedFiles.filter(

      f => f !== item

    );

  }

  // =========================
  // FILE ICON
  // =========================

  getFileIcon(item:any):string {

    const file =
    item?.file;

    if(!file)
      return 'description';

    if(
      file?.type ===
      'application/pdf'
    ){

      return 'picture_as_pdf';

    }

    if(
      file?.type?.startsWith(
        'video/'
      )
    ){

      return 'video_file';

    }

    if(
      file?.type?.startsWith(
        'audio/'
      )
    ){

      return 'audio_file';

    }

    if(
      file?.type?.includes(
        'word'
      )
    ){

      return 'description';

    }

    if(
      file?.type?.includes(
        'excel'
      )
    ){

      return 'table_chart';

    }

    return 'insert_drive_file';

  }

  // =========================
  // TYPING
  // =========================

  onTyping(){

    this.socketSer.typing({

      conversationId:
      this.conversationId,

      userId:
      this.userId

    });

    clearTimeout(
      this.typingTimeout
    );

    this.typingTimeout =
    setTimeout(() => {

      this.socketSer.stopTyping({

        conversationId:
        this.conversationId,

        userId:
        this.userId

      });

    }, 1000);

  }

  // =========================
  // SEND MESSAGE
  // =========================

  sendMessage(){

    if(

      !this.text?.trim()

      &&

      !this.selectedFiles.length

    ){

      return;

    }

    const formData =
    new FormData();

    formData.append(

      'conversationId',

      this.conversationId

    );

    formData.append(

      'text',

      this.text

    );

    let messageType =
    'text';

    // FILES

    if(this.selectedFiles.length){

      this.selectedFiles.forEach(

        (item:any) => {

          if(item?.file){

            formData.append(

              'files',

              item.file

            );

          }

        }

      );

      const firstFile =
      this.selectedFiles[0]?.file;

      // IMAGE

      if(

        firstFile?.type?.startsWith(
          'image/'
        )

      ){

        messageType =
        'image';

      }

      // PDF

      else if(

        firstFile?.type ===
        'application/pdf'

      ){

        messageType =
        'file';

      }

      // VIDEO

      else if(

        firstFile?.type?.startsWith(
          'video/'
        )

      ){

        messageType =
        'video';

      }

      // AUDIO

      else if(

        firstFile?.type?.startsWith(
          'audio/'
        )

      ){

        messageType =
        'audio';

      }

      // OTHER

      else{

        messageType =
        'file';

      }

    }

    formData.append(

      'messageType',

      messageType

    );

    // SEND TO PARENT

    this.send.emit(
      formData
    );

    // RESET

    this.text = '';

    this.selectedFiles.forEach(

      item => {

        if(item?.preview){

          URL.revokeObjectURL(
            item.preview
          );

        }

      }

    );

    this.selectedFiles = [];

    // STOP TYPING

    this.socketSer.stopTyping({

      conversationId:
      this.conversationId,

      userId:
      this.userId

    });

  }

  // =========================
  // CLEANUP
  // =========================

  ngOnDestroy(){

    clearTimeout(
      this.typingTimeout
    );

    this.selectedFiles.forEach(

      item => {

        if(item?.preview){

          URL.revokeObjectURL(
            item.preview
          );

        }

      }

    );

  }

}