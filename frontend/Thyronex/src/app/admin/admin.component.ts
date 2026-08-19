import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface PatientUploadSlot {
  patientName: string;
  fileName: string;
  fileSize: number;
  pdfBase64: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  adminKeyInput: string = '';
  isAuthenticated: boolean = false;
  errorMessage: string = '';
  isLoading: boolean = false;
  bookings: any[] = [];

  // Segregation & Filtering State
  selectedTab: 'PENDING' | 'COMPLETED' | 'ALL' = 'PENDING';
  searchQuery: string = '';

  // Multi-Patient Upload Modal State
  activeBookingForUpload: any = null;
  patientUploadSlots: PatientUploadSlot[] = [];
  adminRemarks: string = 'Report verified and released by Chief Pathologist.';
  isUploading: boolean = false;

  // Success Modal State
  showSuccessModal: boolean = false;
  successModalMessage: string = '';
  successBookingDetails: any = null;

  private API_URL = 'http://localhost:8080/api/lab-packages';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const savedKey = sessionStorage.getItem('admin_token');
    if (savedKey) {
      this.adminKeyInput = savedKey;
      this.loadAllBookings();
    }
  }

  onAdminLogin(): void {
    if (!this.adminKeyInput) {
      this.errorMessage = 'Please enter the Admin Secret Key';
      return;
    }
    this.loadAllBookings();
  }

  loadAllBookings(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const headers = new HttpHeaders({ 'X-Admin-Key': this.adminKeyInput });

    this.http.get<any[]>(`${this.API_URL}/admin/all-bookings`, { headers }).subscribe({
      next: (data) => {
        this.bookings = data || [];
        this.isAuthenticated = true;
        this.isLoading = false;
        sessionStorage.setItem('admin_token', this.adminKeyInput);
      },
      error: () => {
        this.errorMessage = 'Invalid Admin Key or Unauthorized';
        this.isAuthenticated = false;
        this.isLoading = false;
        sessionStorage.removeItem('admin_token');
      }
    });
  }

  // Live Filtering getter based on Tab + Search Query
  get filteredBookings(): any[] {
    return this.bookings.filter(item => {
      // 1. Tab Filter
      if (this.selectedTab === 'PENDING' && item.status === 'COMPLETED') return false;
      if (this.selectedTab === 'COMPLETED' && item.status !== 'COMPLETED') return false;

      // 2. Search Query Filter
      if (this.searchQuery && this.searchQuery.trim()) {
        const query = this.searchQuery.trim().toLowerCase();
        const idMatch = `#${item.id}`.includes(query) || `${item.id}` === query;
        const nameMatch = (item.patientName || '').toLowerCase().includes(query);
        const phoneMatch = (item.patientPhone || '').includes(query);
        const packageMatch = (item.packageName || '').toLowerCase().includes(query);
        const addressMatch = (item.address || '').toLowerCase().includes(query);

        return idMatch || nameMatch || phoneMatch || packageMatch || addressMatch;
      }

      return true;
    });
  }

  getPendingCount(): number {
    return this.bookings.filter(b => b.status !== 'COMPLETED').length;
  }

  getCompletedCount(): number {
    return this.bookings.filter(b => b.status === 'COMPLETED').length;
  }

  openUploadModal(booking: any): void {
    this.activeBookingForUpload = booking;
    this.adminRemarks = 'Report verified and released by Chief Pathologist.';
    this.patientUploadSlots = [];

    const namesStr = booking.patientName || 'Valued Patient';
    const splitNames = namesStr.split(',').map((n: string) => n.trim()).filter((n: string) => n.length > 0);
    const count = Math.max(splitNames.length, booking.patientCount || 1);

    for (let i = 0; i < count; i++) {
      const pName = splitNames[i] || `Patient ${i + 1}`;
      this.patientUploadSlots.push({
        patientName: pName,
        fileName: '',
        fileSize: 0,
        pdfBase64: ''
      });
    }

    if (booking.reportData) {
      try {
        const parsed = JSON.parse(booking.reportData);
        if (parsed.reports && Array.isArray(parsed.reports)) {
          parsed.reports.forEach((rep: any, idx: number) => {
            if (this.patientUploadSlots[idx]) {
              this.patientUploadSlots[idx].fileName = rep.fileName || '';
              this.patientUploadSlots[idx].fileSize = rep.fileSize || 0;
              this.patientUploadSlots[idx].pdfBase64 = rep.pdfBase64 || '';
            }
          });
        } else if (parsed.pdfBase64 && this.patientUploadSlots[0]) {
          this.patientUploadSlots[0].fileName = parsed.fileName || 'Report.pdf';
          this.patientUploadSlots[0].fileSize = parsed.fileSize || 0;
          this.patientUploadSlots[0].pdfBase64 = parsed.pdfBase64;
        }
      } catch (e) {
        console.warn('Could not parse reports:', e);
      }
    }
  }

  closeUploadModal(): void {
    this.activeBookingForUpload = null;
    this.patientUploadSlots = [];
  }

  onPatientFileSelected(event: any, index: number): void {
    const file: File = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please select a valid PDF document (.pdf).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      alert('File size exceeds 15MB limit. Please compress the file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.patientUploadSlots[index].fileName = file.name;
      this.patientUploadSlots[index].fileSize = file.size;
      this.patientUploadSlots[index].pdfBase64 = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  areAllReportsUploaded(): boolean {
    return this.patientUploadSlots.length > 0 && this.patientUploadSlots.every(s => s.pdfBase64 && s.pdfBase64.length > 0);
  }

  getFileSize(bytes: number): string {
    if (!bytes) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  }

  submitUploadedReports(): void {
    if (!this.areAllReportsUploaded()) {
      alert('Please upload reports for all booked patients.');
      return;
    }

    this.isUploading = true;

    const token = this.adminKeyInput || sessionStorage.getItem('admin_token') || 'ThyronexAdmin@2026';
    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'X-Admin-Key': token 
    });

    const reportPayload = {
      bookingId: this.activeBookingForUpload.id,
      patientCount: this.patientUploadSlots.length,
      uploadedAt: new Date().toISOString(),
      remarks: this.adminRemarks,
      reports: this.patientUploadSlots
    };

    const reportJson = JSON.stringify(reportPayload);

    const payload = {
      reportJson: reportJson,
      pdfBase64: this.patientUploadSlots[0]?.pdfBase64 || ''
    };

    this.http.post(`${this.API_URL}/bookings/${this.activeBookingForUpload.id}/submit-report`, payload, { headers })
      .subscribe({
        next: () => {
          this.isUploading = false;
          this.activeBookingForUpload.status = 'COMPLETED';
          this.activeBookingForUpload.reportData = reportJson;

          this.successBookingDetails = {
            id: this.activeBookingForUpload.id,
            patientPhone: this.activeBookingForUpload.patientPhone
          };
          this.successModalMessage = `All diagnostic reports have been verified and dispatched to the patient's registered WhatsApp and Email.`;

          this.closeUploadModal();
          this.showSuccessModal = true;
          this.loadAllBookings();
        },
        error: (err) => {
          this.isUploading = false;
          console.error('Upload report error:', err);
          const errorMsg = err.error?.error || err.error?.message || err.message || 'Server error';
          alert('Failed to send reports: ' + errorMsg);
        }
      });
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
    this.successBookingDetails = null;
    this.successModalMessage = '';
  }

  formatBookingDate(dateStr: string): string {
    if (!dateStr) return 'Recent';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  formatBookingTime(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? '' : d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  onLogout(): void {
    this.isAuthenticated = false;
    this.adminKeyInput = '';
    sessionStorage.removeItem('admin_token');
  }
}