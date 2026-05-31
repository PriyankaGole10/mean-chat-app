import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-group-info-modal',
  standalone: true,
  imports: [],
  templateUrl: './group-info-modal.component.html',
  styleUrl: './group-info-modal.component.scss'
})
export class GroupInfoModalComponent {
@Input() group = '';
showRoles = false;
}
