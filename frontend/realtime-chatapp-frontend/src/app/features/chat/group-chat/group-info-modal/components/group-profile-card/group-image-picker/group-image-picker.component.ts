import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-group-image-picker',
  standalone:true,
  templateUrl:'./group-image-picker.component.html',
  styleUrls:['./group-image-picker.component.scss']
})
export class GroupImagePickerComponent {

  @Output()
  imageSelected =
    new EventEmitter<File>();

  @Output()
  close =
    new EventEmitter<void>();

  @ViewChild('fileInput')
  fileInput!: ElementRef<HTMLInputElement>;

  @ViewChild('video')
  video!: ElementRef<HTMLVideoElement>;

  showMenu = true;

  cameraMode = false;

  previewUrl = '';

  selectedFile!: File;

  stream:any;

  openPhotos() {
    this.fileInput.nativeElement.click();
  }

  openFiles() {
    this.fileInput.nativeElement.click();
  }

  async openCamera() {

    this.cameraMode = true;

    this.stream =
      await navigator
      .mediaDevices
      .getUserMedia({
        video:true
      });

    setTimeout(() => {

      this.video.nativeElement.srcObject =
      this.stream;

    });
  }

  capture() {

    const canvas =
      document.createElement('canvas');

    canvas.width =
      this.video.nativeElement.videoWidth;

    canvas.height =
      this.video.nativeElement.videoHeight;

    const ctx =
      canvas.getContext('2d');

    ctx?.drawImage(
      this.video.nativeElement,
      0,
      0
    );

    canvas.toBlob(blob=>{

      if(!blob) return;

      this.selectedFile =
      new File(
        [blob],
        'camera.jpg',
        {type:'image/jpeg'}
      );

      this.previewUrl =
      URL.createObjectURL(
        this.selectedFile
      );

      this.stream
      ?.getTracks()
      ?.forEach(
        (t:any)=>t.stop()
      );

      this.cameraMode = false;

    });

  }

  onFileSelected(event:any){

    const file =
      event.target.files[0];

    if(!file) return;

    this.selectedFile = file;

    this.previewUrl =
      URL.createObjectURL(file);
  }

  save(){

    this.imageSelected.emit(
      this.selectedFile
    );
  }

}