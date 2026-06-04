import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MemberListItemComponent } from "../../../../../../shared/components/member-list-item/member-list-item.component";
import { EmptyStateComponent } from "../../../../../../shared/components/empty-state/empty-state.component";
import { MemberProfileCardComponent } from "../member-profile-card/member-profile-card.component";
import { UserService } from '../../../../../../core/services/user.service';
import { NonExistingGroupMembersComponent } from "../non-existing-group-members/non-existing-group-members.component";

@Component({
  selector: 'app-group-members',
  standalone: true,
  imports: [MemberListItemComponent, EmptyStateComponent, MemberProfileCardComponent, NonExistingGroupMembersComponent],
  templateUrl: './group-members.component.html',
  styleUrl: './group-members.component.scss'
})
export class GroupMembersComponent {
  private userSer = inject(UserService)
  @Input() members: any[] = [];
  @Input() canManage: boolean = false;
  @Input() group:any;;
  @Output() close = new EventEmitter<void>();
  @Output() memberClick  = new EventEmitter<void>();

  @Output() openAddMembers  = new EventEmitter<void>();

showAddMembersPanel:boolean= false;

  selectedMember: any;
  currentUser = this.userSer.currentUser;


  constructor(){
  // console.log('members',this.members)
  }

 openMemberProfile(member: any) {
  // console.log('CLICKED MEMBER', member);
  this.selectedMember = member;
}

addMembersPanelOpen(){
  this.showAddMembersPanel = true;
  this.openAddMembers.emit()
}

  closeProfile() {
 this.selectedMember = null;
  }

  loadMembers(){

  }
}
