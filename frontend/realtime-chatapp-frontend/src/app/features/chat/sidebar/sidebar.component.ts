import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  router = inject(Router)

  menus = [
    { icon: 'chat', label: 'Chats', route: '/chat' },
    { icon: 'group', label: 'Groups', route: '/groups' },
    { icon: 'settings', label: 'Settings', route: '/settings' }
  ];

  navigate(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

}
