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
import { EditGroupImageComponent } from "./components/edit-group-image/edit-group-image.component";
import { JoinRequestsComponent } from "./components/join-requests-modal/join-requests-modal.component";
import { GroupRoleModalComponent } from "./components/group-role-modal/group-role-modal.component";
import { InviteLinkModalComponent } from "./components/invite-link-modal/invite-link-modal.component";
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';


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
    EditGroupImageComponent,
    JoinRequestsComponent,
    GroupRoleModalComponent,
    InviteLinkModalComponent,
    EmptyStateComponent
],
  templateUrl: './group-info-modal.component.html',
  styleUrl: './group-info-modal.component.scss'
})
export class GroupInfoModalComponent {

  @Input() group: any;

  @Output() close = new EventEmitter<void>();

  private groupRoleSer =
    inject(GroupRoleService);

  private groupMemberSer =
    inject(GroupMemberService);

  private groupInviteSer =
    inject(GroupInviteService);

  private groupSocketSer =
    inject(GroupSocketService);

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

  admin: any;
  moderators: any[] = [];
  members: any[] = [];

  ngOnInit() {
    this.loadMembers();
    this.loadRequests();

    this.groupSocketSer
      .joinGroup(this.group._id);

    this.listenSockets();
  }

  loadMembers() {
    this.groupMemberSer
      .getMembers(this.group._id)
      .subscribe({
        next: (res: any) => {
          // this.admin = res.admin;
          // this.moderators = res.moderators;
          // this.members = res.members;
          this.totalMembers = res.length
        }
      });
  }

  loadRequests() {

    this.groupInviteSer
      .getPendingRequests(
        this.group._id
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
        localStorage.getItem('user') || '{}'
      );

    const userId = user?._id;

    this.isAdmin =
      this.admin?._id === userId;

    const isModerator =
      this.moderators.some(
        (m: any) =>
          m.user._id === userId
      );

    this.isAdminOrModerator =
      this.isAdmin || isModerator;

    this.canEditGroup =
      this.isAdmin || isModerator;

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
    console.log('Media');
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

  addAdmin(
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
    this.showMembers = true;
    this.showSettings = false;
    this.showRequests = false;
    this.showRoles = false;
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

  this.closeAllPanels();

  this.showAddMembersPanel = true;

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

}