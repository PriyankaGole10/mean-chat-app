import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AvatarComponent } from "../avatar/avatar.component";

@Component({
  selector: 'app-member-list-item',
  standalone: true,
  imports: [AvatarComponent],
  templateUrl: './member-list-item.component.html',
  styleUrl: './member-list-item.component.scss'
})
export class MemberListItemComponent {
@Input() member: any;
@Input() showActions: boolean = false;
// @Output() viewProfile = new EventEmitter<void>();
constructor(){
  console.log('member',this.member)
  }
}
