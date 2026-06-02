import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class SocketService {

  socket!: Socket;

  connect(userId: string) {
    this.socket = io(environment.socketUrl);
    this.socket.emit('user-connected', userId);
  }

  joinConversation(conversationId: string) {
    this.socket.emit('join-conversation', conversationId);
  }

  sendMessage(data: any) {
    this.socket.emit('send-message', data);
  }

  onMessage(cb: any) {
    this.socket.on('receive-message', cb);
  }

  messageDelivered(data: any) {
    this.socket.emit('message-delivered', data);
  }

  onMessageDelivered(cb: any) {
    this.socket.on('message-delivered', cb);
  }

  messageSeen(data: any) {
    this.socket.emit('message-seen', data);
  }

  onMessageSeen(cb: any) {
    this.socket.on('message-seen', cb);
  }

  typing(data: any) {
    this.socket.emit('typing', data);
  }

  onTyping(cb: any) {
    this.socket.on('typing', cb);
  }

  onStopTyping(cb: any) {
    this.socket.on('stop-typing', cb);
  }

  stopTyping(data: any) {
    this.socket.emit('stop-typing', data);
  }

  onOnlineUsers(cb: any) {
    this.socket.on('online-users', cb);
  }

// BLOCK USER
  blockUser(data: { blockerId: string; blockedId: string }) {
  this.socket.emit('block-user', data);
}

unblockUser(data: { blockerId: string; blockedId: string }) {
  this.socket.emit('unblock-user', data);
}

onUserBlocked(cb: any) {
  this.socket.on('user-blocked', cb);
}

onUserUnblocked(cb: any) {
  this.socket.on('user-unblocked', cb);
}

muteConversation(data: { userId: string; conversationId: string }) {
  this.socket.emit('mute-conversation', data);
}

unmuteConversation(data: {
  userId: string;
  conversationId: string;
}) {
  this.socket.emit('unmute-conversation', data);
}

onConversationMuted(cb: any) {
  this.socket.on('conversation-muted', cb);
}

onConversationUnmuted(cb: any) {
  this.socket.on('conversation-unmuted', cb);
}

searchMessages(data: { conversationId: string; query: string }) {
  this.socket.emit('search-messages', data);
}

onSearchResults(cb: any) {
  this.socket.on('search-results', cb);
}

requestMedia(data: { conversationId: string }) {
  this.socket.emit('request-media', data);
}

onMediaResponse(cb: any) {
  this.socket.on('media-response', cb);
}
}