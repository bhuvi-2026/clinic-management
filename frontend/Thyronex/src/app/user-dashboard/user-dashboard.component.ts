import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LabService } from '../lab.service';

export interface BookingItem {
  id: number;
  packageName?: string;
  patientName?: string;
  age?: number;
  gender?: string;
  schedule?: string;
  status: string;
  reportData?: string;
  isExpanded?: boolean; // ⭐ Tracks accordion state
}

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  userName: string = '';
  userEmail: string = '';
  userMobile: string = '';
  
  bookings: BookingItem[] = [];
  isLoading: boolean = true;

  constructor(
    private labService: LabService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userName = localStorage.getItem('userName') || 'Valued Patient';
    this.userEmail = localStorage.getItem('userEmail') || '';
    this.userMobile = localStorage.getItem('userMobile') || '';

    if (this.userMobile) {
      this.fetchHistory(this.userMobile);
    } else {
      this.isLoading = false;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  fetchHistory(mobile: string): void {
    this.isLoading = true;
    this.labService.getLabBookingHistory(mobile).subscribe({
      next: (data) => {
        // Initialize every booking with isExpanded: false
        this.bookings = (data || []).map((b: any) => ({
          ...b,
          isExpanded: false
        }));
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Failed to load booking history', err);
        this.isLoading = false;
      }
    });
  }

  // ⭐ Toggles expansion on mobile/tablet
  toggleRow(booking: BookingItem): void {
    booking.isExpanded = !booking.isExpanded;
  }

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
      alert('Report file not available yet.');
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

  goBackHome(): void {
    this.router.navigate(['/']);
  }
}