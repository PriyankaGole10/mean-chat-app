import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

  private router = inject(Router);

  // User preferences
  darkMode = false;
  notifications = true;

  // User data
  currentUser: any = null;

  ngOnInit(): void {

    const user = sessionStorage.getItem('user');

    if (user) {
      this.currentUser = JSON.parse(user);
    }

    // Load saved preferences
    const darkMode = sessionStorage.getItem('darkMode');
    const notifications = sessionStorage.getItem('notifications');

    this.darkMode = darkMode === 'true';
    this.notifications = notifications !== 'false';
  }

  // ================= NAVIGATION =================

  goBack(): void {
    this.router.navigate(['/chat']);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  // ================= SETTINGS =================

  toggleDarkMode(): void {

    this.darkMode = !this.darkMode;

    sessionStorage.setItem(
      'darkMode',
      String(this.darkMode)
    );

    // Optional: add theme class to body
    document.body.classList.toggle(
      'dark-theme',
      this.darkMode
    );
  }

  toggleNotifications(): void {

    this.notifications = !this.notifications;

    sessionStorage.setItem(
      'notifications',
      String(this.notifications)
    );
  }

  // ================= PRIVACY =================

  manageBlockedUsers(): void {
    console.log('Open blocked users page');
  }

  editLastSeen(): void {
    console.log('Open last seen settings');
  }

  // ================= ACCOUNT =================

  changePassword(): void {
    console.log('Navigate to change password page');
  }

  logout(): void {

    sessionStorage.clear();

    sessionStorage.removeItem('darkMode');
    sessionStorage.removeItem('notifications');

    this.router.navigate(['/login']);
  }

}