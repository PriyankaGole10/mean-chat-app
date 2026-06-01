import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupRoleService } from '../../../../core/services/group-role.service';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { GroupMemberService } from '../../../../core/services/group-member.service';


@Component({
  selector: 'app-group-info-modal',
  standalone: true,
  imports: [
    CommonModule,
    AvatarComponent
  ],
  templateUrl: './group-info-modal.component.html',
  styleUrl: './group-info-modal.component.scss'
})
export class GroupInfoModalComponent {

  @Input() group: any;

  @Output()
  close = new EventEmitter<void>();

   private groupRoleSer =
  inject(GroupRoleService);

  private groupMemberSer  =
  inject(GroupMemberService);

  showMembers = false;
  showSettings = false;
  showRequests = false;
  showRoles = false;

 admin: any;
moderators: any[] = [];
members: any[] = [];

ngOnInit(){
  this.loadMembers();
}

loadMembers(){
  this.groupMemberSer
  .getMembers(this.group._id)
  .subscribe({
    next:(res:any)=>{
      this.admin = res.admin;
      this.moderators = res.moderators;
      this.members = res.members;
    }
  });
}

  closeModal(){
    this.close.emit();
  }

  makeModerator(
    userId: string
  ){
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
  ){
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
  ){
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
  ){
    this.groupRoleSer.removeAdmin(
      this.group._id,
      userId
    ).subscribe({
      next: (group: any) => {
        this.group = group;
      }
    });
  }

  openMembers(){
    this.showMembers = true;
    this.showSettings = false;
    this.showRequests = false;
    this.showRoles = false;
  }

  openRoles(){
    this.showRoles = true;
    this.showMembers = false;
    this.showSettings = false;
    this.showRequests = false;
  }

  openSettings(){
    this.showSettings = true;
    this.showMembers = false;
    this.showRoles = false;
    this.showRequests = false;
  }

  openRequests(){
    this.showRequests = true;
    this.showMembers = false;
    this.showRoles = false;
    this.showSettings = false;
  }

}