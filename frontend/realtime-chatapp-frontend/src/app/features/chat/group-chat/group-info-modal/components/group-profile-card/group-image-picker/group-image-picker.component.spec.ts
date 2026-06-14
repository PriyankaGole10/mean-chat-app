import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupImagePickerComponent } from './group-image-picker.component';

describe('GroupImagePickerComponent', () => {
  let component: GroupImagePickerComponent;
  let fixture: ComponentFixture<GroupImagePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupImagePickerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupImagePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
