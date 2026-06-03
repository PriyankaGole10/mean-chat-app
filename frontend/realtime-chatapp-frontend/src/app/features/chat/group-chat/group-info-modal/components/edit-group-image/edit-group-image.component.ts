import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '../../../../../../shared/components/avatar/avatar.component';
import { GroupService } from '../../../../../../core/services/group.service';
import { GroupSettingsService } from '../../../../../../core/services/group-settings.service';

@Component({
  selector: 'app-edit-group-image',
  standalone: true,
  imports: [CommonModule, AvatarComponent],
  templateUrl: './edit-group-image.component.html',
  styleUrl: './edit-group-image.component.scss'
})
export class EditGroupImageComponent {

  @Input() groupId!: string;
  @Input() previewUrl: string = '';

  @Output() close = new EventEmitter<void>();
  @Output() updated = new EventEmitter<string>();

  //  private groupSer = inject(GroupService);
   private groupSettingSer = inject(GroupSettingsService);

  selectedFile!: File;

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  upload() {
  const reader = new FileReader();

  reader.onload = () => {
    const imageUrl = reader.result as string;

    this.groupSettingSer.updateImage(this.groupId, imageUrl)
      .subscribe({
        next: (res: any) => {
          this.updated.emit(res.groupImage);
          this.close.emit();
        }
      });
  };

  reader.readAsDataURL(this.selectedFile);
}

}
