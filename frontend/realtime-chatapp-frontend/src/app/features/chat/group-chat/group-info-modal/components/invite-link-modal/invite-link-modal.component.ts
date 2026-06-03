import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-invite-link-modal',
  standalone: true,
  imports: [],
  templateUrl: './invite-link-modal.component.html',
  styleUrl: './invite-link-modal.component.scss'
})
export class InviteLinkModalComponent {
@Input() group: any;
}
