import {
  Component,
  inject,
  Input,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { GroupService } from '../../../../core/services/group.service';



@Component({
  selector: 'app-join-requests-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl:
    './join-requests-modal.component.html',
  styleUrl:
    './join-requests-modal.component.scss'
})
export class JoinRequestsModalComponent
implements OnInit {

  @Input()
  groupId = '';

  private groupSer = inject(GroupService  )

  requests: any[] = [];



  ngOnInit() {

    this.loadRequests();

  }

  loadRequests() {

    this.groupSer
      .getJoinRequests(
        this.groupId
      )
      .subscribe({
        next: (res: any) => {

          this.requests = res;

        }
      });

  }

  approve(requestId: string) {

    this.groupSer
      .approveRequest(
        requestId
      )
      .subscribe(() => {

        this.loadRequests();

      });

  }

  reject(requestId: string) {

    this.groupSer
      .rejectRequest(
        requestId
      )
      .subscribe(() => {

        this.loadRequests();

      });

  }

}