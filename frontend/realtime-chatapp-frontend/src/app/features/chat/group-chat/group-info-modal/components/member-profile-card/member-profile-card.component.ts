import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { UserService } from '../../../../../../core/services/user.service';
import { GroupRoleService } from '../../../../../../core/services/group-role.service';
import { GroupMemberService } from '../../../../../../core/services/group-member.service';
import { GroupSettingsService } from '../../../../../../core/services/group-settings.service';

@Component({
  selector: 'app-member-profile-card',
  standalone: true,
  imports: [],
  templateUrl: './member-profile-card.component.html',
  styleUrl: './member-profile-card.component.scss'
})
export class MemberProfileCardComponent {

  private userSer = inject(UserService);
  private groupMemberService = inject(GroupMemberService);
  private groupRoleService = inject(GroupRoleService);
  private groupSettingsService = inject(GroupSettingsService);

  @Input() group: any;
  @Input() member: any;
  @Input() isAdmin=false;
  @Output() close = new EventEmitter<void>();
  currentUser = this.userSer.currentUser;
  // isCurrentUser=true;
commonGroupsOfMember:any[]= [];
 

  get isCurrentUser(): boolean {

    return this.currentUser?._id === this.member?._id;

  }
  ngOnInit(){
    this.getcommonGroupsOfMember();
  }


makeAdmin(){

this.groupRoleService.addAdmin(this.group._id,this.member._id).subscribe((res:any)=>{
// console.log('addAdmin',res)
})

}

removeMember() {
this.groupMemberService.removeMember(this.group._id,this.member._id).subscribe((res:any)=>{
// console.log('removeMember',res)
this.close.emit()
})
}

getcommonGroupsOfMember(){
this.groupMemberService.commonGroupsWithMember(this.member._id).subscribe((res:any)=>{
console.log('getcommonGroupsOfMember',res);
this.commonGroupsOfMember = res;

})
}






}
