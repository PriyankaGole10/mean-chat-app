import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupInviteService } from '../../../../../../core/services/group-invite.service';

@Component({
  selector: 'app-join-requests-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './join-requests-modal.component.html',
  styleUrl: './join-requests-modal.component.scss'
})
export class JoinRequestsComponent {

  @Input() groupId!: string;
  @Input() requests: any[] = [];
  private inviteSer = inject (GroupInviteService)

  @Output() close = new EventEmitter<void>();
  @Output() updated = new EventEmitter<void>();

  ngOnInit(){
    
  }


  approve(requestId: string) {
    this.inviteSer.approveRequest( this.groupId,requestId)
      .subscribe(() => this.updated.emit());
  }

  reject(requestId: string) {
    this.inviteSer.rejectRequest( this.groupId,requestId)
      .subscribe(() => this.updated.emit());
  }
}