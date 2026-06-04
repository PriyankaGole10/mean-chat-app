import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonExistingGroupMembersComponent } from './non-existing-group-members.component';

describe('NonExistingGroupMembersComponent', () => {
  let component: NonExistingGroupMembersComponent;
  let fixture: ComponentFixture<NonExistingGroupMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonExistingGroupMembersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NonExistingGroupMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
