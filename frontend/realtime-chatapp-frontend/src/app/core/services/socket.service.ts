import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class SocketService {

    socket!: Socket;

    connect(userId: string) {
        this.socket = io(environment.apiUrl);

        this.socket.emit('user-connected', userId);
    }

    joinConversation(conversationId: string) {
        this.socket.emit('joinConversation', conversationId);
    }

    sendMessage(data: any) {
        this.socket.emit('send-message', data);
    }

    onMessage(callback: (msg: any) => void) {
        this.socket.on('receive-message', callback);
    }

    onTyping(callback: (data: any) => void) {
        this.socket.on("typing", callback);
    }

    onStopTyping(callback: (data: any) => void) {
        this.socket.on("stop-typing", callback);
    }

    typing(data: any) {
        this.socket.emit("typing", data);
    }

    stopTyping(data: any) {
        this.socket.emit("stop-typing", data);
    }

     messageSeen(data: any) {
    this.socket.emit('message-seen', data);
  }

  onMessageSeen(callback: (data: any) => void) {
    this.socket.on('message-seen', callback);
  }
}