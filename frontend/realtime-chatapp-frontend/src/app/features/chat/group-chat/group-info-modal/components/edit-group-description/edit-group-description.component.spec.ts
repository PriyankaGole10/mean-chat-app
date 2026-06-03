import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGroupDescriptionComponent } from './edit-group-description.component';

describe('EditGroupDescriptionComponent', () => {
  let component: EditGroupDescriptionComponent;
  let fixture: ComponentFixture<EditGroupDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditGroupDescriptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditGroupDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
