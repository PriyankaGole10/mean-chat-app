import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatSidebarComponent } from '../chat-sidebar/chat-sidebar.component';
import { ChatWindowComponent } from '../chat-window/chat-window.component';
import { GroupModalComponent } from '../chat-sidebar/components/group-modal/group-modal.component';

import { ConversationService } from '../../../core/services/conversation.service';
import { SocketService } from '../../../core/services/socket.service';
import { ProfileModalComponent } from "./components/profile-modal/profile-modal.component";
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GroupInfoModalComponent } from "../group-chat/group-info-modal/group-info-modal.component";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [
    CommonModule,
    ChatSidebarComponent,
    ChatWindowComponent,
    GroupModalComponent,
    ProfileModalComponent,
    GroupInfoModalComponent
  ],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss'
})
export class ChatPageComponent {

  private conversationSer = inject(ConversationService);
  private userService = inject(UserService);
  private socketSer = inject(SocketService);
  private userSer = inject(UserService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  conversations: any[] = [];
  messages: any[] = [];

  selectedConversation: any = null;

  currentUser: any;
  onlineUsers: string[] = [];

  typingUser = '';
  unreadCounts: any = {};

  activePanel: 'list' | 'chat' = 'list';


  allUsers: any[] = [];

  openGroupModal = false;
  showProfileModal = false;
  isMobile = false;
  selectedGroup: any = null;
  showGroupInfoModal = false;
  isMutedSub!:Subscription;
  isBlockedSub!:Subscription;

  // ================= INIT =================
  ngOnInit() {
    this.checkScreen();
    window.addEventListener('resize', this.checkScreen.bind(this));

    const user = sessionStorage.getItem('user');
    this.currentUser = user ? JSON.parse(user) : null;
   

    this.socketSer.connect(this.currentUser._id);

    this.loadConversations();
    this.listenSocket();
    this.getAllUsers();

    this.isMutedSub =this.userService.isMute.subscribe((res:any)=>{
       this.loadConversations();
    })
    this.isBlockedSub =this.userService.isBlocked.subscribe((res:any)=>{
       this.loadConversations();
    })
  }

  ngOnDestroy(){
    this.isBlockedSub?.unsubscribe;
    this.isMutedSub?.unsubscribe;
  }

  getAllUsers() {
    this.userSer.getAllUsers().subscribe((res: any) => {
      this.allUsers = res;
    })
  }


  openGroupInfo(group: any) {
    this.selectedGroup = group;
    this.showGroupInfoModal = true;
  }

  checkScreen() {
    this.isMobile = window.innerWidth <= 768;
  }

  // ================= SOCKET =================
  listenSocket() {

    this.socketSer.onMessage((msg: any) => {

      if (!this.selectedConversation ||
        msg.conversation !== this.selectedConversation._id) return;

      this.messages.push(msg);

      this.socketSer.messageSeen({
        messageId: msg._id,
        conversationId: msg.conversation,
        userId: this.currentUser._id
      });

      this.updateLastMessage(msg);
    });

    this.socketSer.onOnlineUsers((users: any) => {
      this.onlineUsers = users;
    });

    this.socketSer.onTyping(() => this.typingUser = 'typing...');
    this.socketSer.onStopTyping(() => this.typingUser = '');
  }

  // ================= LOAD =================
  loadConversations() {
    this.conversationSer.getUserConversations()
      .subscribe((res: any) => this.conversations = res || []);
  }

  // ================= SELECT CHAT =================
  onChatSelected(chat: any) {
    this.selectedConversation = chat;

    this.socketSer.joinConversation(chat._id);

    this.conversationSer.getMessages(chat._id)
      .subscribe((res: any) => this.messages = res || []);

    // switch panel on mobile
    if (this.isMobile) {
      this.activePanel = 'chat';
    }
  }

  // ================= SEND MESSAGE =================
  sendMessage(formData: FormData) {

    const temp = {
      _id: 'temp_' + Date.now(),
      text: formData.get('text'),
      sender: this.currentUser,
      conversation: this.selectedConversation._id,
      createdAt: new Date(),
      status: 'sending'
    };

    this.messages.push(temp);

    this.conversationSer.sendMessages(formData)
      .subscribe((res: any) => {

        const i = this.messages.findIndex(m => m._id === temp._id);

        if (i !== -1) {
          this.messages[i] = res;
        }

        this.socketSer.sendMessage(res);

        this.updateLastMessage(res);
      });
  }

  // ================= UPDATE CONVERSATION =================
  updateLastMessage(msg: any) {

    const index = this.conversations.findIndex(
      c => c._id === msg.conversation
    );

    if (index === -1) return;

    this.conversations[index].lastMessage = msg;

    const updated = this.conversations.splice(index, 1)[0];
    this.conversations.unshift(updated);
  }

  // ================= GROUP =================
  createGroupChat(data: any) {

    this.conversationSer.createGroup(data)
      .subscribe((res: any) => {

        this.loadConversations();
        this.onChatSelected(res);

        this.openGroupModal = false;
        this.snackBar.open(
          'Group created successfully',
          'Close',
          {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          }
        );
      },
        (err) => {

          this.snackBar.open(
            err?.error?.message || 'Failed to create group',
            'Close',
            {
              duration: 4000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            }
          );

          console.error(err);
        }
      );
  }

  // ================= PERSONAL CHAT =================
  createConversation(user: any) {

    this.conversationSer.createConversations(user._id)
      .subscribe((res: any) => {

        this.loadConversations();
        this.onChatSelected(res);
      });
  }

  logout() {
    sessionStorage.clear();
    location.href = '/login';
  }

  openProfile() {
    this.showProfileModal = true;
  }


  openGroupSettings() {
    console.log('Open group settings:', this.selectedConversation);
  }

  openSettings() {
    this.router.navigate(['/settings']);
  }
}