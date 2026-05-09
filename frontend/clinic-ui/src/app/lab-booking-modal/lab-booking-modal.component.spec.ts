import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabBookingModalComponent } from './lab-booking-modal.component';

describe('LabBookingModalComponent', () => {
  let component: LabBookingModalComponent;
  let fixture: ComponentFixture<LabBookingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabBookingModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabBookingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
