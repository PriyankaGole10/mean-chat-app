import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AvatarComponent } from "../../../../../../shared/components/avatar/avatar.component";

@Component({
  selector: 'app-group-profile-card',
  standalone: true,
  imports: [AvatarComponent],
  templateUrl: './group-profile-card.component.html',
  styleUrl: './group-profile-card.component.scss'
})
export class GroupProfileCardComponent {
  @Input() group:any;
@Input() totalMembers=0;
@Input() canEdit=false;

@Output() editImage =
new EventEmitter<void>();

@Output() editDescription =
new EventEmitter<void>();

@Output() addMembers =
new EventEmitter<void>();

}
