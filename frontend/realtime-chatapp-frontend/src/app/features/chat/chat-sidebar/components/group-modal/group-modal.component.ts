import {
  CommonModule
} from '@angular/common';

import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

@Component({
  selector: 'app-group-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl:
    './group-modal.component.html',
  styleUrl:
    './group-modal.component.scss'
})

export class GroupModalComponent {

  @Input() allUsers: any[] = [];

  @Output() close =
    new EventEmitter<void>();

  @Output() create =
    new EventEmitter<any>();

  groupName = '';

  selectedUsers: any[] = [];


  ngOnInit(){
    console.log('allUsers',this.allUsers)
  }

  toggleUser(user: any) {

    const exists =
      this.selectedUsers.find(
        u => u._id === user._id
      );

    if (exists) {

      this.selectedUsers =
        this.selectedUsers.filter(
          u => u._id !== user._id
        );

    } else {

      this.selectedUsers.push(user);

    }
  }

  isSelected(user: any) {

    return this.selectedUsers.some(
      u => u._id === user._id
    );
  }

  submit() {

    this.create.emit({

      groupName:
        this.groupName,

      participants:
        this.selectedUsers.map(
          u => u._id
        )

    });

  }

}