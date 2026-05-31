import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupAvatarComponent } from './group-avatar.component';

describe('GroupAvatarComponent', () => {
  let component: GroupAvatarComponent;
  let fixture: ComponentFixture<GroupAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupAvatarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
