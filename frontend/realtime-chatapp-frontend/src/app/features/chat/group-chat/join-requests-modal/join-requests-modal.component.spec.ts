import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinRequestsModalComponent } from './join-requests-modal.component';

describe('JoinRequestsModalComponent', () => {
  let component: JoinRequestsModalComponent;
  let fixture: ComponentFixture<JoinRequestsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinRequestsModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JoinRequestsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
