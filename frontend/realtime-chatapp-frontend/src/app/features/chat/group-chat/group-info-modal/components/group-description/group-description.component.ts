import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-group-description',
  standalone: true,
  imports: [],
  templateUrl: './group-description.component.html',
  styleUrl: './group-description.component.scss'
})
export class GroupDescriptionComponent {
 @Input() description: string = '';
}
