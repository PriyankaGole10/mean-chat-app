import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupMemberService } from '../../../../../../core/services/group-member.service';

@Component({
  selector: 'app-edit-group-members',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-group-members.component.html',
  styleUrl: './edit-group-members.component.scss'
})
export class EditGroupMembersComponent {

  @Input() groupId!: string;
  @Input() members: any[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() updated = new EventEmitter<void>();

  private groupMemberSer = inject(GroupMemberService);


  removeMember(userId: string) {
    this.groupMemberSer.removeMember(this.groupId, userId)
      .subscribe({
        next: () => this.updated.emit()
      });
  }
}
