import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabService } from '../lab.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  @Input() name: string = '';
  @Input() email: string = '';
  @Input() mobile: string = '';
  @Output() backToHome = new EventEmitter<void>();

  bookings: any[] = [];

  constructor(private labService: LabService) { }

  ngOnInit(): void {
    const targetMobile = this.mobile || localStorage.getItem('userMobile') || '';
    if (targetMobile) {
      this.fetchHistory(targetMobile);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mobile'] && this.mobile) {
      this.fetchHistory(this.mobile);
    } else if (!this.mobile) {
      const cached = localStorage.getItem('userMobile');
      if (cached) {
        this.fetchHistory(cached);
      }
    }
  }

  fetchHistory(mobile: string): void {
    if (!mobile) return;
    this.labService.getLabBookingHistory(mobile).subscribe({
      next: (data) => {
        this.bookings = data || [];
      },
      error: (err: any) => console.error('Failed to load booking history', err)
    });
  }

  // Parses individual reports from booking.reportData
  getPatientReports(booking: any): any[] {
    if (!booking.reportData) return [];
    try {
      const parsed = JSON.parse(booking.reportData);
      if (parsed.reports && Array.isArray(parsed.reports)) {
        return parsed.reports;
      } else if (parsed.pdfBase64) {
        return [{
          patientName: booking.patientName || 'Patient',
          fileName: parsed.fileName || 'Thyronex_Report.pdf',
          pdfBase64: parsed.pdfBase64
        }];
      }
    } catch (e) {
      return [];
    }
    return [];
  }

  downloadSpecificReport(report: any, defaultName: string): void {
    if (!report.pdfBase64 || !report.pdfBase64.includes('base64,')) {
      alert('Report file not found.');
      return;
    }

    try {
      const base64Content = report.pdfBase64.split('base64,')[1];
      const byteCharacters = atob(base64Content);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = report.fileName || `Thyronex_${defaultName.replace(/[^a-zA-Z0-9]/g, '_')}_Report.pdf`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (e) {
      console.error('Download error:', e);
      alert('Could not download report.');
    }
  }
}