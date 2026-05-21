import { Component, inject } from '@angular/core';
import { ChatWindowComponent } from '../chat-window/chat-window.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MessageInputComponent } from "../message-input/message-input.component";
import { ChatSidebarComponent } from '../chat-sidebar/chat-sidebar.component';
import { ConversationService } from '../../../core/services/conversation.service';
import { SocketService } from '../../../core/services/socket.service';


@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [SidebarComponent, ChatSidebarComponent, ChatWindowComponent, MessageInputComponent],
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
  typingUser: string | null = null;

  ngOnInit() {
    const user = localStorage.getItem('user');
     if (!user) {
    console.error('User not found in localStorage');
    return;
  }
    this.currentUser = user ? JSON.parse(user) : null;

      // SAFETY CHECK
  if (!this.currentUser?._id) {
    console.error('Invalid user object');
    return;
  }

    this.socketSer.connect(this.currentUser._id);

    // RECEIVE MESSAGE
    this.socketSer.onMessage((msg) => {
      if (this.selectedConversation && msg.conversation === this.selectedConversation._id) {
        this.messages.push(msg);
      }
    })

    // TYPING
    this.socketSer.onTyping((data: any) => {
      // this.typingUser = data.userId;
      console.log('Typing...', data);
    })

    this.socketSer.onStopTyping(() => {
      // this.typingUser = null;
       console.log('Stop typing');
    })

    //SEEN
    this.socketSer.onMessageSeen((data: any) => {
      const msg = this.messages.find(m => m._id === data.messageId);
      if (msg) {
        msg.seen = true;
      }
    })

    this.loadConversations();
  }

  loadConversations() {
    this.conversationSer.getAllConversations().subscribe(
      (res: any) => {
        this.conversations = res;
      },
      (error) => {
        console.error(error.error.message)
      }
    )
  }

  onChatSelected(chat: any) {
    this.selectedConversation = chat;
    this.socketSer.joinConversation(chat._id);
    this.loadMessages(chat._id);
  }

  loadMessages(id: string) {
    this.conversationSer.getMessages(id).subscribe(
      (res: any) => { this.messages = res }
    )
  }

  sendMessage(text: string) {
    const message = {
      conversation: this.selectedConversation._id,
      sender: this.currentUser._id,
      text
    };
    this.messages.push(message);
    this.socketSer.sendMessage(message);
  }



}
