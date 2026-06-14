import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupRoleService } from '../../../../core/services/group-role.service';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { GroupMemberService } from '../../../../core/services/group-member.service';
import { GroupInviteService } from '../../../../core/services/group-invite.service';
import { GroupSocketService } from '../../../../core/services/group-socket.service';
import { GroupProfileCardComponent } from "./components/group-profile-card/group-profile-card.component";
import { GroupMembersComponent } from "./components/group-members/group-members.component";
import { AddMembersComponent } from "./components/add-group-members/add-members.component";
import { EditGroupDescriptionComponent } from "./components/edit-group-description/edit-group-description.component";
import { JoinRequestsComponent } from "./components/join-requests-modal/join-requests-modal.component";
import { GroupRoleModalComponent } from "./components/group-role-modal/group-role-modal.component";
import { InviteLinkModalComponent } from "./components/invite-link-modal/invite-link-modal.component";
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { MemberProfileCardComponent } from "./components/member-profile-card/member-profile-card.component";
import { NonExistingGroupMembersComponent } from "./components/non-existing-group-members/non-existing-group-members.component";
import { GroupSettingsService } from '../../../../core/services/group-settings.service';
import { GroupService } from '../../../../core/services/group.service';
import { SocketService } from '../../../../core/services/socket.service';
import { GroupImagePickerComponent } from "./components/group-profile-card/group-image-picker/group-image-picker.component";


@Component({
  selector: 'app-group-info-modal',
  standalone: true,
  imports: [
    CommonModule,
    AvatarComponent,
    GroupProfileCardComponent,
    GroupMembersComponent,
    AddMembersComponent,
    EditGroupDescriptionComponent,
    
    JoinRequestsComponent,
    GroupRoleModalComponent,
    InviteLinkModalComponent,
    EmptyStateComponent,
    MemberProfileCardComponent,
    NonExistingGroupMembersComponent,
    GroupImagePickerComponent
],
  templateUrl: './group-info-modal.component.html',
  styleUrl: './group-info-modal.component.scss'
})
export class GroupInfoModalComponent {
private socketSer = inject(SocketService);
 private groupSettingsService = inject(GroupSettingsService);
  @Input() group: any;

  @Output() close = new EventEmitter<void>();
  selectedMember: any = null;

  private groupRoleSer =
    inject(GroupRoleService);

  private groupMemberSer =
    inject(GroupMemberService);

  private groupInviteSer =
    inject(GroupInviteService);

  private groupSocketSer =
    inject(GroupSocketService);
     public groupSer = inject(GroupService);

  totalMembers = 0;

  pendingRequests: any[] = [];
  users: any[] = [];

  isAdmin = false;

  isAdminOrModerator = false;

  showMembers = false;
  showSettings = false;
  showRequests = false;
  showRoles = false;
  canEditGroup = false;

  showMembersPanel = false;
  showAddMembersPanel = false;
  showEditDescriptionPanel = false;
  showEditImagePanel = false;

  showMedia = false;
  showInviteLink = false;

  // admin: any;
  moderators: any[] = [];
  admins: any[] = [];
  members: any[] = [];

  ngOnInit() {
    this.loadMembers();
    this.loadRequests();

    this.groupSocketSer
      .joinGroup(this.group?._id);

    this.listenSockets();
  }

  loadMembers() {
    this.groupMemberSer.getMembers(this.group?._id || this.groupSer.selectedGroup?._id).subscribe(
      (res: any[]) => {

        // const admin = res.find(m => m.role === 'admin');

        const moderators = res.filter(m => m?.role === 'moderator');

       this.members = res.map(m => ({
          ...m?.user,
          role: m?.role
        }));

        // this.admin = admin?.user || null;
        // console.log('this.admin',this.admin)
        // console.log('admin',admin)
        this.admins = this.members.filter((m=> m?.role=='admin'))
        this.moderators = moderators.map(m => m?.user);
       
        // console.log('this.members',this.members)
        this.groupSer.groupMembers = this.members

        this.totalMembers = res?.length;

        this.checkPermissions();
      },
    );
  }

  loadRequests() {

    this.groupInviteSer
      .getPendingRequests(
        this.group?._id || this.groupSer.selectedGroup?._id
      )
      .subscribe((res: any) => {

        this.pendingRequests = res;

      });

  }

  listenSockets() {

    this.groupSocketSer
      .onMemberAdded(data => {

        this.loadMembers();

      });

    this.groupSocketSer
      .onMemberRemoved(data => {

        this.loadMembers();

      });

    this.groupSocketSer
      .onRoleUpdated(data => {

        this.loadMembers();

      });

    this.groupSocketSer
      .onGroupUpdated(data => {

        Object.assign(
          this.group,
          data
        );

      });

  }

  

  checkPermissions() {

    const user =
      JSON.parse(
        sessionStorage.getItem('user') || '{}'
      );

    const userId = user?._id;
    // console.log(userId,user)

    this.isAdmin =
      this.admins?.some((a:any)=>a?._id===userId);

    const isModerator =
      this.moderators.some(
        (m: any) =>
          m.user._id === userId
      );

    this.isAdminOrModerator =
      this.isAdmin || isModerator;

    this.canEditGroup =
      this.isAdmin || isModerator;

      // console.log('canEditGroup',this.canEditGroup)

  }

  closeGroupInfoModal(){
    this.close.emit();
    this.groupSer.isShowGroupInfo = false
  }

  openInviteLink() {

    this.showInviteLink = true;

    this.showMembers = false;
    this.showSettings = false;
    this.showRequests = false;
    this.showRoles = false;

  }

  leaveGroup() {

    const confirmLeave =
      confirm(
        'Leave this group?'
      );

    if (!confirmLeave) {
      return;
    }

    this.groupMemberSer
      .leaveGroup(
        this.group._id
      )
      .subscribe({

        next: () => {

          this.closeModal();

        },

        error: (err) => {

          alert(
            err.error?.message
          );

        }

      });

  }

  openMedia() {
     const conversationId = this.groupSer.selectedCoversation?._id;

    this.socketSer.requestMedia({
      conversationId
    });
    this.closeAllPanels();
    this.groupSer.isShowAddMembersPanel = false;
    this.showAddMembersPanel = false
  }

  closeModal() {
    this.close.emit();
  }

  makeModerator(
    userId: string
  ) {
    this.groupRoleSer.makeModerator(
      this.group._id,
      userId
    ).subscribe({
      next: (group: any) => {
        this.group = group;
      }
    });
  }

  removeModerator(
    userId: string
  ) {
    this.groupRoleSer.removeModerator(
      this.group._id,
      userId
    ).subscribe({
      next: (group: any) => {
        this.group = group;
      }
    });
  }

  makeAdmin(
    userId: string
  ) {
    this.groupRoleSer.addAdmin(
      this.group._id,
      userId
    ).subscribe({
      next: (group: any) => {
        this.group = group;
      }
    });
  }

  removeAdmin(
    userId: string
  ) {
    this.groupRoleSer.removeAdmin(
      this.group._id,
      userId
    ).subscribe({
      next: (group: any) => {
        this.group = group;
      }
    });
  }

  openMembers() {
    this.closeAllPanels();
    this.showMembersPanel = true;
  }

  openRoles() {
    this.showRoles = true;
    this.showMembers = false;
    this.showSettings = false;
    this.showRequests = false;
  }

  openSettings() {
    this.showSettings = true;
    this.showMembers = false;
    this.showRoles = false;
    this.showRequests = false;
  }

  openRequests() {
    this.showRequests = true;
    this.showMembers = false;
    this.showRoles = false;
    this.showSettings = false;
  }


  openAddMembers() {

  this.showMembersPanel = false;
    this.closeAllPanels();

    this.showAddMembersPanel = true;

  }

  closeAddMembers() {

  this.showAddMembersPanel = false;
  this.groupSer.isShowAddMembersPanel = false;

  // opened from header
  if (this.groupSer.isHeaderAddMemberPanel) {

    this.groupSer.isHeaderAddMemberPanel = false;

    this.closeGroupInfoModal();
  }
}

  editDescription() {

    this.closeAllPanels();

    this.showEditDescriptionPanel = true;

  }

  changeGroupImage() {

    this.closeAllPanels();

    this.showEditImagePanel = true;

  }

  closeAllPanels() {

    this.showMembersPanel = false;
    this.showAddMembersPanel = false;
    this.showEditDescriptionPanel = false;
    this.showEditImagePanel = false;
    this.showSettings = false;
    this.showRequests = false;
    this.showRoles = false;

  }


  openMemberProfile(member: any) {
  this.selectedMember = member;
   this.showMembersPanel = false;
}

closeMemberProfile() {
  this.selectedMember = null;
  this.showMembersPanel = true;
}

clearChat() {

  const ok =
    confirm(
      "Clear all messages in this group?"
    );

  if (!ok) return;

  this.groupSettingsService
    .clearChat(this.group._id)
    .subscribe({

      next: () => {

        this.close.emit();

      }

    });

}


uploadGroupImage(file: File) {

  const formData = new FormData();

  formData.append(
    'groupId',
    this.group._id
  );

  formData.append(
    'image',
    file
  );

  this.groupSettingsService
    .updateGroupImage(formData)
    .subscribe({

      next: (res: any) => {

        this.group.groupImage =
          res.groupImage;

        this.showEditImagePanel = false;

      },

      error: err => {
        console.error(err);
      }

    });

}


}