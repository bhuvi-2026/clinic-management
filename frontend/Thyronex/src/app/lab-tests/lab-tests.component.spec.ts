import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabTestsComponent } from './lab-tests.component';

describe('LabTestsComponent', () => {
  let component: LabTestsComponent;
  let fixture: ComponentFixture<LabTestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabTestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
