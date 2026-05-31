import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
selector:'app-confirm-dialog',
standalone:true,
imports:[CommonModule],
templateUrl:'./confirm-dialog.component.html',
styleUrl:'./confirm-dialog.component.scss'
})
export class ConfirmDialogComponent{

@Input() title='Confirm Action';
@Input() message='Are you sure?';
@Input() confirmText='Confirm';
@Input() cancelText='Cancel';
@Input() danger=false;

@Output() confirm=new EventEmitter<void>();
@Output() cancel=new EventEmitter<void>();

onConfirm(){
this.confirm.emit();
}

onCancel(){
this.cancel.emit();
}

}