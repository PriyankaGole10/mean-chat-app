import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediadetailsSidebarComponent } from './mediadetails-sidebar.component';

describe('MediadetailsSidebarComponent', () => {
  let component: MediadetailsSidebarComponent;
  let fixture: ComponentFixture<MediadetailsSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediadetailsSidebarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MediadetailsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
