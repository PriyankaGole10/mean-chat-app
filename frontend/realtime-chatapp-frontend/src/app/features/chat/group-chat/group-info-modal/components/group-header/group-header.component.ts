import { Component } from '@angular/core';
import { AvatarComponent } from "../../../../../../shared/components/avatar/avatar.component";

@Component({
  selector: 'app-group-header',
  standalone: true,
  imports: [AvatarComponent],
  templateUrl: './group-header.component.html',
  styleUrl: './group-header.component.scss'
})
export class GroupHeaderComponent {

}
