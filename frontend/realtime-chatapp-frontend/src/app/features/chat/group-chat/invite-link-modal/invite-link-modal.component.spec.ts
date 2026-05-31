import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteLinkModalComponent } from './invite-link-modal.component';

describe('InviteLinkModalComponent', () => {
  let component: InviteLinkModalComponent;
  let fixture: ComponentFixture<InviteLinkModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InviteLinkModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InviteLinkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
