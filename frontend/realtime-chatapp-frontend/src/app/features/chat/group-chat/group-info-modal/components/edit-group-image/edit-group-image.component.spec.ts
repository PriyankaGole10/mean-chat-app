import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGroupImageComponent } from './edit-group-image.component';

describe('EditGroupImageComponent', () => {
  let component: EditGroupImageComponent;
  let fixture: ComponentFixture<EditGroupImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditGroupImageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditGroupImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
