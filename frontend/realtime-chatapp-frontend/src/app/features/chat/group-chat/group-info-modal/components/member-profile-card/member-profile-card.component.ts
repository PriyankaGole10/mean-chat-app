import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { UserService } from '../../../../../../core/services/user.service';

@Component({
  selector: 'app-member-profile-card',
  standalone: true,
  imports: [],
  templateUrl: './member-profile-card.component.html',
  styleUrl: './member-profile-card.component.scss'
})
export class MemberProfileCardComponent {
  private userSer = inject(UserService);

  @Input() member: any;
  @Output() close = new EventEmitter<void>();
  currentUser = this.userSer.currentUser;
  // isCurrentUser=true;

  constructor() {
    // console.log('currentUser', this.currentUser)
  }

  get isCurrentUser(): boolean {

    return this.currentUser?._id === this.member?._id;

  }





}
