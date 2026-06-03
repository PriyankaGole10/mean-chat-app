import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserSelectorComponent } from '../../../../../../shared/components/user-selector/user-selector.component';
import { GroupMemberService } from '../../../../../../core/services/group-member.service';
@Component({
  selector: 'app-add-members',
  standalone: true,
  imports: [UserSelectorComponent],
  templateUrl: './add-members.component.html',
  styleUrl: './add-members.component.scss'
})
export class AddMembersComponent {

  private groupMemberSer = inject(GroupMemberService)
  @Input() groupId!: string;
  @Input() users: any[] = [];
//   @Input() members:any[]=[]
// @Input() canManage=false

  @Output() close = new EventEmitter<void>();
  @Output() updated = new EventEmitter<void>();

  selectedUsers: any[] = [];


  addMembers() {

    const userIds = this.selectedUsers.map(u => u._id);

    if (!userIds.length) return;

    this.groupMemberSer.addMembers(this.groupId, userIds)
      .subscribe({
        next: () => {
          this.updated.emit();
          this.close.emit();
        }
      });
  }

}
