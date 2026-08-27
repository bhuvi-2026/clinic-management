import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustAccreditationsComponent } from './trust-accreditations.component';

describe('TrustAccreditationsComponent', () => {
  let component: TrustAccreditationsComponent;
  let fixture: ComponentFixture<TrustAccreditationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrustAccreditationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrustAccreditationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
