import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPackagesComponent } from './test-packages.component';

describe('TestPackagesComponent', () => {
  let component: TestPackagesComponent;
  let fixture: ComponentFixture<TestPackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestPackagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
