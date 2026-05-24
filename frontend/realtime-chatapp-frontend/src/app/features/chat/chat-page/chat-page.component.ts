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
  onlineUsers: string[] = [];
  selectedConversation: any = null;
  messages: any[] = [];
  currentUser: any;
  typingUser: string = '';
  unreadCounts: any = {};

  ngOnInit() {
    const user = sessionStorage.getItem('user');
    if (!user) {
      console.error('User not found in sessionStorage');
      return;
    }
    this.currentUser = user ? JSON.parse(user) : null;

    // SAFETY CHECK
    if (!this.currentUser?._id) {
      console.error('Invalid user object');
      return;
    }

    // SOCKET  CONNECTION WITH USERID
    this.socketSer.connect(this.currentUser._id);

    // RECEIVE MESSAGE
    this.socketSer.onMessage((msg) => {

      const exists = this.messages.find(
        m => m._id === msg._id
      );

      if (!exists) {

        if (
          this.selectedConversation &&
          msg.conversation === this.selectedConversation._id
        ) {

          this.messages.push(msg);

        }

      }

      // UPDATE SIDEBAR
      this.updateConversationLastMessage(msg);

    });

    // TYPING
    this.socketSer.onTyping((data: any) => {
      this.typingUser = 'Typing...';
      // this.typingUser = data.userId;
      console.log('Typing...', data);
    })

    this.socketSer.onStopTyping(() => {
      this.typingUser = '';
      console.log('Stop typing');
    })

    //SEEN
    this.socketSer.onMessageSeen((data: any) => {
      const msg = this.messages.find(m => m._id === data.messageId);
      if (msg) {
        msg.status = 'seen';
      }
    })

    this.socketSer.onOnlineUsers((users: string[]) => {
      this.onlineUsers = users;
    })

    this.getUserConversations();
  }

  getUserConversations() {
    this.conversationSer.getUserConversations().subscribe(
      (res: any) => {
        this.conversations = res;
        this.calculateunreadCounts();
      },
      (error) => {
        console.error(error.error.message)
      }
    )
  }

  calculateunreadCounts() {
  this.unreadCounts = {};
  this.conversations.forEach((conversation: any) => {
      this.conversationSer.getMessages(conversation._id)
        .subscribe((messages: any) => {
          const unread =messages.filter((msg: any) =>
                msg.sender._id !==this.currentUser._id && !msg.seenBy?.includes(
                  this.currentUser._id
                )).length;

          this.unreadCounts[conversation._id] = unread;

        });

    });

}

  onChatSelected(chat: any) {
    this.selectedConversation = chat;
    this.unreadCounts[chat._id] = 0;
    this.socketSer.joinConversation(chat._id);
    this.loadMessages(chat._id);
    setTimeout(()=>{
      this.messages.forEach((msg:any) => {
        if(msg.sender !== this.currentUser._id){
          this.socketSer.messageSeen({
           conversationId: chat._id,
           messageId: msg._id
          })
        }
      })
    },1000)
  }

  loadMessages(id: string) {
    this.conversationSer.getMessages(id).subscribe(
      (res: any) => { this.messages = res }
    )
  }

  sendMessage(text: string) {
    if (!text.trim()) return;
    const payload = {
      conversationId: this.selectedConversation._id,
      // sender: this.currentUser._id,
      messageType: 'text',
      text
    };
    // this.messages.push(message);
    // this.socketSer.sendMessage(message);

    // SAVE MESSAGE IN DB
    this.conversationSer.sendMessages(payload).subscribe(
      (res: any) => {
        this.messages.push(res);
        this.socketSer.sendMessage(res);
        this.updateConversationLastMessage(res);
      },
      (err) => {
        console.error(err.error.message)
      }
    )
  }

  updateConversationLastMessage(message:any){
   const index = this.conversations.findIndex(c=> c.id === message.conversation)
   if(index === -1) return;

   this.conversations[index].lastMessage = message;

   const updatedConversation =  this.conversations.splice(index, 1)[0];
   this.conversations.unshift(updatedConversation)
  }



}
