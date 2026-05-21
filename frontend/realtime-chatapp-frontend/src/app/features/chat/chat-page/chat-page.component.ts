import { Component } from '@angular/core';
import { ChatWindowComponent } from '../chat-window/chat-window.component';
import { SidebarComponent } from '../sidebar/sidebar.component';


@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [SidebarComponent,ChatWindowComponent],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss'
})
export class ChatPageComponent {

}
