import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MemberListItemComponent } from "../../../../../../shared/components/member-list-item/member-list-item.component";
import { EmptyStateComponent } from "../../../../../../shared/components/empty-state/empty-state.component";

@Component({
  selector: 'app-group-members',
  standalone: true,
  imports: [MemberListItemComponent, EmptyStateComponent],
  templateUrl: './group-members.component.html',
  styleUrl: './group-members.component.scss'
})
export class GroupMembersComponent {
@Input() members: any[] = [];
@Input() canManage: boolean = false;
@Output() close = new EventEmitter<void>();
}
