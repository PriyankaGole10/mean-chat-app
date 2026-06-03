import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-member-list-item',
  standalone: true,
  imports: [],
  templateUrl: './member-list-item.component.html',
  styleUrl: './member-list-item.component.scss'
})
export class MemberListItemComponent {
@Input() member: any;
@Input() showActions: boolean = false;
}
