import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupRoleModalComponent } from './group-role-modal.component';

describe('GroupRoleModalComponent', () => {
  let component: GroupRoleModalComponent;
  let fixture: ComponentFixture<GroupRoleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupRoleModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupRoleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
