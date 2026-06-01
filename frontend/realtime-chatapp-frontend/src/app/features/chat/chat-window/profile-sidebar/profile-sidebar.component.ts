import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-sidebar.component.html',
  styleUrls: ['./profile-sidebar.component.scss']
})
export class ProfileSidebarComponent {

  @Input() isOpen: boolean = false;
  @Input() user: any = null;

  @Output() close = new EventEmitter<void>();
  @Output() block = new EventEmitter<void>();
  @Output() mute = new EventEmitter<void>();

  // 🔥 close on ESC key
  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.isOpen) {
      this.close.emit();
    }
  }

  // 🔥 click outside handler (optional improvement)
  onBackdropClick(event: MouseEvent) {
    this.close.emit();
  }

  onSidebarClick(event: MouseEvent) {
    event.stopPropagation(); // prevent closing when clicking inside
  }

  onClose() {
    this.close.emit();
  }

  onBlock() {
    if (!this.user) return;
    this.block.emit();
  }

  onMute() {
    if (!this.user) return;
    this.mute.emit();
  }
}