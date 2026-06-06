import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { UserService } from '../../../../../../core/services/user.service';
import { GroupMemberService } from '../../../../../../core/services/group-member.service';
import { CommonModule } from '@angular/common';
import { GroupService } from '../../../../../../core/services/group.service';

@Component({
  selector: 'app-non-existing-group-members',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './non-existing-group-members.component.html',
  styleUrl: './non-existing-group-members.component.scss'
})
export class NonExistingGroupMembersComponent {
  private groupSer = inject(GroupService);
  private userService = inject(UserService)
  private groupMemberService = inject(GroupMemberService)
  @Input() groupId!: string;

  @Input() existingMembers: any[] = [];

  @Output() close =
    new EventEmitter<void>();

  @Output() added =
    new EventEmitter<void>();

  users: any[] = [];
  filteredUsers: any[] = [];
  selectedUsers: any[] = [];

  ngOnChanges() {
    // console.log('existingMembers',this.existingMembers)
  }

  ngOnInit() {

    this.loadUsers();
    this.existingMembers = this.groupSer.selectedGroup.participants.map((m: any) => {
      return {
        ...m?.user,
        role: m?.role
      }
    })
  }

  loadUsers() {


    // console.log('existingMembers',this.existingMembers)
    this.userService
      .getAllUsers()
      .subscribe(
        (users: any) => {
          const memberIds =
            this.existingMembers.map(
              m => m._id
            );

          this.filteredUsers =
            users.filter(
              (user: any) =>
                !memberIds.includes(
                  user._id
                )
            );

        }
      );

  }

  toggleUser(user: any) {

    const index =
      this.selectedUsers.findIndex(
        u => u._id === user._id
      );

    if (index > -1) {

      this.selectedUsers.splice(
        index,
        1
      );

    } else {

      this.selectedUsers.push(user);

    }

  }

  addMembers() {

    const userIds =
      this.selectedUsers.map(
        u => u._id
      );

    this.groupMemberService
      .addMembers(
        this.groupId,
        userIds
      )
      .subscribe({

        next: () => {

          this.added.emit();

          this.close.emit();

        }

      });

  }

  isSelected(user: any): boolean {
    return this.selectedUsers.some(
      u => u._id === user._id
    );
  }
}
