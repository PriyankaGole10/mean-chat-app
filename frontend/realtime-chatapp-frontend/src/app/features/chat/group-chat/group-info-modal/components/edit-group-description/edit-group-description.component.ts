import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupService } from '../../../../../../core/services/group.service';
import { GroupSettingsService } from '../../../../../../core/services/group-settings.service';

@Component({
  selector: 'app-edit-group-description',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-group-description.component.html',
  styleUrl: './edit-group-description.component.scss'
})
export class EditGroupDescriptionComponent {

  @Input() groupId!: string;
  @Input() description: string = '';

  @Output() close = new EventEmitter<void>();
  @Output() updated = new EventEmitter<string>();
  private groupSettingSer = inject(GroupSettingsService);

  

  save() {

    this.groupSettingSer.updateGroupDescription( 
      {
        groupId:this.groupId,
      groupDescription: this.description
    }).subscribe({
      next: (res: any) => {
        this.updated.emit(res.groupDescription);
        this.close.emit();
      }
    });

  }
}