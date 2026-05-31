import {
  CommonModule
} from '@angular/common';

import {
  Component,
  EventEmitter,
  inject,
  Output
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  UserService
} from '../../../../../core/services/user.service';
import { AvatarComponent } from "../../../../../shared/components/avatar/avatar.component";

@Component({
  selector: 'app-search-users',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    AvatarComponent
],

  templateUrl:
    './search-users.component.html',

  styleUrl:
    './search-users.component.scss'
})
export class SearchUsersComponent {

  @Output()
  startChat =
    new EventEmitter<any>();

  private userSer =
    inject(UserService);

  searchText = '';

  searchedUsers: any[] = [];

  searchTimeout: any;

  onSearch() {

    clearTimeout(
      this.searchTimeout
    );

    this.searchTimeout =
      setTimeout(() => {

        if (
          !this.searchText.trim()
        ) {

          this.searchedUsers = [];

          return;
        }

        this.userSer
          .searchUsers(this.searchText)
          .subscribe({

            next: (res: any) => {

              this.searchedUsers =
                res || [];

            },

            error: (err) => {

              console.error(err);

            }

          });

      }, 400);

  }

  selectUser(user: any) {

    this.startChat.emit(user);

    this.searchText = '';

    this.searchedUsers = [];

  }

}