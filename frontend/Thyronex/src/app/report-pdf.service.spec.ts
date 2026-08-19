import { TestBed } from '@angular/core/testing';

import { ReportPdfService } from './report-pdf.service';

describe('ReportPdfService', () => {
  let service: ReportPdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportPdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
