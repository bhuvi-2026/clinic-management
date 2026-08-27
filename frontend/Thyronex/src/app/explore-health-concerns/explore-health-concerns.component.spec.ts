import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreHealthConcernsComponent } from './explore-health-concerns.component';

describe('ExploreHealthConcernsComponent', () => {
  let component: ExploreHealthConcernsComponent;
  let fixture: ComponentFixture<ExploreHealthConcernsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExploreHealthConcernsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExploreHealthConcernsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
