import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  menus = [

    {
      icon: 'chat',
      label: 'Chats'
    },

    {
      icon: 'groups',
      label: 'Groups'
    },

    {
      icon: 'call',
      label: 'Calls'
    },

    {
      icon: 'settings',
      label: 'Settings'
    }
  ];

}
