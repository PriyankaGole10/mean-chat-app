import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupProfileCardComponent } from './group-profile-card.component';

describe('GroupProfileCardComponent', () => {
  let component: GroupProfileCardComponent;
  let fixture: ComponentFixture<GroupProfileCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupProfileCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupProfileCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
