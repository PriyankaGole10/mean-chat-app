import { Injectable } from '@angular/core';

import {
  io,
  Socket
} from 'socket.io-client';

import { environment }
from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})

export class SocketService {

  socket!: Socket;

  connect(userId: string) {

    this.socket = io(
      environment.socketUrl
    );

    this.socket.emit(
      'user-connected',
      userId
    );

  }

  joinConversation(
    conversationId: string
  ) {

    this.socket.emit(
      'join-conversation',
      conversationId
    );

  }

  sendMessage(data: any) {

    this.socket.emit(
      'send-message',
      data
    );

  }

  onMessage(
    callback: (msg: any) => void
  ) {

    this.socket.on(
      'receive-message',
      callback
    );

  }

  typing(data: any) {

    this.socket.emit(
      'typing',
      data
    );

  }

  onTyping(
    callback: (data: any) => void
  ) {

    this.socket.on(
      'typing',
      callback
    );

  }

  stopTyping(data: any) {

    this.socket.emit(
      'stop-typing',
      data
    );

  }

  onStopTyping(
    callback: (data: any) => void
  ) {

    this.socket.on(
      'stop-typing',
      callback
    );

  }

  messageDelivered(
    data: {
      messageId: string,
      conversationId: string
    }
  ) {

    this.socket.emit(
      'message-delivered',
      data
    );

  }

  onMessageDelivered(
    callback: (data: any) => void
  ) {

    this.socket.on(
      'message-delivered',
      callback
    );

  }

  messageSeen(
    data: any
  ) {

    this.socket.emit(
      'message-seen',
      data
    );

  }

  onMessageSeen(
    callback: (data: any) => void
  ) {

    this.socket.on(
      'message-seen',
      callback
    );

  }

  onOnlineUsers(
    callback: (
      users: string[]
    ) => void
  ) {

    this.socket.on(
      'online-users',
      callback
    );

  }

}