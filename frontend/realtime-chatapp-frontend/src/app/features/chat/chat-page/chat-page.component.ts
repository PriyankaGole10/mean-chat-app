import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SidebarComponent } from '../sidebar/sidebar.component';
import { ChatSidebarComponent } from '../chat-sidebar/chat-sidebar.component';
import { ChatWindowComponent } from '../chat-window/chat-window.component';

import { ConversationService } from '../../../core/services/conversation.service';
import { SocketService } from '../../../core/services/socket.service';

@Component({
  selector: 'app-chat-page',
  standalone: true,

  imports: [
    CommonModule,
    SidebarComponent,
    ChatSidebarComponent,
    ChatWindowComponent
  ],

  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss'
})
export class ChatPageComponent {

  private conversationSer = inject(ConversationService);
  private socketSer = inject(SocketService);

  conversations: any[] = [];
  selectedConversation: any = null;

  messages: any[] = [];

  currentUser: any;

  typingUser = '';
  onlineUsers: string[] = [];
  unreadCounts: any = {};

  // =========================
  // INIT
  // =========================
  ngOnInit() {

    const user = sessionStorage.getItem('user');
    this.currentUser = user ? JSON.parse(user) : null;

    if (!this.currentUser?._id) return;

    this.socketSer.connect(this.currentUser._id);

    this.getUserConversations();

    this.listenSocketEvents();
  }

  // =========================
  // SOCKET EVENTS
  // =========================
  listenSocketEvents() {

    this.socketSer.onMessage((msg: any) => {

      if (!this.selectedConversation) return;

      if (msg.conversation !== this.selectedConversation._id) return;

      const exists = this.messages.some(m => m._id === msg._id);
      if (exists) return;

      this.messages.push({
        ...msg,
        status: 'delivered'
      });

      this.socketSer.messageDelivered({
        messageId: msg._id,
        conversationId: this.selectedConversation._id
      });

      this.socketSer.messageSeen({
        messageId: msg._id,
        conversationId: this.selectedConversation._id,
        userId: this.currentUser._id
      });

      this.updateConversationLastMessage(msg);
    });

    this.socketSer.onMessageDelivered((data: any) => {
      this.messages = this.messages.map(msg => {
        if (msg._id === data.messageId) {
          return { ...msg, status: 'delivered' };
        }
        return msg;
      });
    });

    this.socketSer.onMessageSeen((data: any) => {
      this.messages = this.messages.map(msg => {
        if (msg._id === data.messageId) {
          return {
            ...msg,
            status: 'seen',
            seenBy: [...(msg.seenBy || []), data.userId]
          };
        }
        return msg;
      });
    });

    this.socketSer.onTyping((data: any) => {
      if (this.selectedConversation?._id === data.conversationId) {
        this.typingUser = 'typing...';
      }
    });

    this.socketSer.onStopTyping(() => {
      this.typingUser = '';
    });

    this.socketSer.onOnlineUsers((users: string[]) => {
      this.onlineUsers = users;
    });
  }

  // =========================
  // SELECT CHAT
  // =========================
  onChatSelected(chat: any) {

    this.selectedConversation = chat;

    this.socketSer.joinConversation(chat._id);

    this.loadMessages(chat._id);
  }

  // =========================
  // LOAD MESSAGES
  // =========================
  loadMessages(id: string) {

    this.conversationSer.getMessages(id).subscribe((res: any) => {
      this.messages = res || [];

      setTimeout(() => this.markSeen(), 500);
    });

  }

  // =========================
  // SEND MESSAGE
  // =========================
  sendMessage(formData: FormData) {

    const tempId = 'temp-' + Date.now();

    const tempMessage = {
      _id: tempId,
      text: formData.get('text'),
      mediaUrls: [],
      sender: this.currentUser,
      status: 'sending',
      conversation: this.selectedConversation._id,
      createdAt: new Date()
    };

    this.messages.push(tempMessage);

    this.conversationSer.sendMessages(formData).subscribe({

      next: (res: any) => {

        const index = this.messages.findIndex(m => m._id === tempId);

        if (index !== -1) {
          this.messages[index] = {
            ...res,
            status: 'sent'
          };
        }

        this.socketSer.sendMessage(res);

        this.updateConversationLastMessage(res);
      },

      error: () => {

        const index = this.messages.findIndex(m => m._id === tempId);

        if (index !== -1) {
          this.messages[index].status = 'failed';
        }
      }

    });

  }

  // =========================
  // MARK SEEN
  // =========================
  markSeen() {

    this.messages.forEach(msg => {

      const senderId = msg.sender?._id || msg.sender;

      if (
        senderId !== this.currentUser._id &&
        !msg.seenBy?.includes(this.currentUser._id)
      ) {

        this.socketSer.messageSeen({
          messageId: msg._id,
          conversationId: this.selectedConversation._id,
          userId: this.currentUser._id
        });
      }

    });

  }

  // =========================
  // UPDATE LAST MESSAGE
  // =========================
  updateConversationLastMessage(message: any) {

    const index = this.conversations.findIndex(
      c => c._id === (message.conversation?._id || message.conversation)
    );

    if (index === -1) return;

    this.conversations[index].lastMessage = message;

    const updated = this.conversations.splice(index, 1)[0];
    this.conversations.unshift(updated);
  }

  // =========================
  // GET CONVERSATIONS
  // =========================
  getUserConversations() {
    this.conversationSer.getUserConversations()
      .subscribe((res: any) => {
        this.conversations = res || [];
      });
  }

  // =========================
  // CREATE PERSONAL CHAT
  // =========================
  createConversation(user: any) {

    this.conversationSer.createConversations(user._id).subscribe({

      next: (conversation: any) => {
        this.getUserConversations();
        this.onChatSelected(conversation);
      },

      error: (err) => console.error(err)
    });
  }

  // =========================
  // CREATE GROUP CHAT
  // =========================
  createGroupChat(data: any) {

    this.conversationSer.createGroup(data).subscribe({

      next: (group: any) => {

        this.getUserConversations();

        this.onChatSelected(group);
      },

      error: (err) => console.error(err)
    });
  }
}