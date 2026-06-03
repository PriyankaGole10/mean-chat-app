import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-user-selector',
  standalone: true,
  imports: [],
  templateUrl: './user-selector.component.html',
  styleUrl: './user-selector.component.scss'
})
export class UserSelectorComponent {


   @Input() users: any[] = [];
   @Output() selectionChange = new EventEmitter<any[]>();
}
