import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { AvatarComponent } from "../../../../../../shared/components/avatar/avatar.component";

@Component({
  selector: 'app-group-profile-card',
  standalone: true,
  templateUrl: './group-profile-card.component.html',
  styleUrls: ['./group-profile-card.component.scss'],
  imports: [AvatarComponent]
})
export class GroupProfileCardComponent {

  @Input() group:any;

  @Input() totalMembers = 0;

  @Input() canEdit = false;

  @Output() editImage =
    new EventEmitter<void>();

  @Output() editDescription =
    new EventEmitter<void>();

}