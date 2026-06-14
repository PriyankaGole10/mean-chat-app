import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-mediadetails-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './mediadetails-sidebar.component.html',
  styleUrl: './mediadetails-sidebar.component.scss'
})
export class MediadetailsSidebarComponent {


  @Input() isOpenMediaFiles: any;
  @Input() mediaFiles: any[] = [];
  @Output() close = new EventEmitter<void>();


  openFile(url: string) {
  if (!url) return;

  window.open(url, '_blank');
}
}
