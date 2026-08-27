import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabTestsComponent } from "../lab-tests/lab-tests.component";
import { LoginComponent } from "../login/login.component";
import { UserDashboardComponent } from "../user-dashboard/user-dashboard.component";
import { LabService } from '../lab.service';
import { ExploreHealthConcernsComponent } from '../explore-health-concerns/explore-health-concerns.component';
import { TrustAccreditationsComponent } from '../trust-accreditations/trust-accreditations.component';
import { AdminComponent } from "../admin/admin.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LabTestsComponent, ExploreHealthConcernsComponent, TrustAccreditationsComponent, LoginComponent, UserDashboardComponent, AdminComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  @Input() isLoggedIn = false;
  @Input() userName = '';
  @Input() userEmail = '';
  @Input() loggedInUserMobile = '';
  labPhone: string = '';
  labTimings: string = '6:00 AM – 8:00 PM';

  showLoginOverlay = false;
  showPhoneModal = false;

  @Input() set loginTrigger(val: boolean) {
    if (val) this.showLoginOverlay = true;
  }

  @Output() loginStateChange = new EventEmitter<{ name: string, email: string }>();
  @Output() closeLogin = new EventEmitter<void>();

  currentView: 'home' | 'tests' | 'dashboard' = 'home';

  constructor(private labService: LabService) {}

  // =========================================================================
  // 🕒 4-HOUR SESSION AUTO-RESTORE ON LOAD / REFRESH
  // =========================================================================
  ngOnInit(): void {
    this.restoreSessionIfValid();
    this.fetchLabContact();
  }
  fetchLabContact(): void {
    this.labService.getContactInfo().subscribe({
      next: (data) => {
        if (data) {
          this.labPhone = data.phone || this.labPhone;
          this.labTimings = data.timings || this.labTimings;
        }
      },
      error: () => {}
    });
  }

  restoreSessionIfValid(): void {
    const sessionStr = localStorage.getItem('user_session');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        const currentTime = new Date().getTime();
        const fourHoursInMillis = 4 * 60 * 60 * 1000; // 4 Hours

        if (session.loginTime && (currentTime - session.loginTime < fourHoursInMillis)) {
          this.isLoggedIn = true;
          this.userName = session.name || 'User';
          this.userEmail = session.email || '';
          this.loggedInUserMobile = session.mobile || '';

          // Sync parent component (e.g. AppComponent / Navbar)
          this.loginStateChange.emit({
            name: this.userName,
            email: this.userEmail
          });
        } else {
          // Session expired beyond 4 hours -> Clean up
          this.clearSession();
        }
      } catch (e) {
        this.clearSession();
      }
    }
  }

  clearSession(): void {
    this.isLoggedIn = false;
    this.userName = '';
    this.userEmail = '';
    this.loggedInUserMobile = '';
    localStorage.removeItem('user_session');
    localStorage.removeItem('userMobile');
    localStorage.removeItem('userName');
  }

  switchToDashboard() {
    this.currentView = 'dashboard';
    document.body.style.overflow = 'hidden';
  }

  handleBackToHome() {
    this.currentView = 'home';
    document.body.style.overflow = 'auto';
  }

  onPhoneBooking(): void {
    this.showPhoneModal = true;
  }

  closePhoneModal(): void {
    this.showPhoneModal = false;
  }


  onWhatsAppBooking(): void {
    if (!this.labPhone) return;

    // Sanitize the phone number fetched from the backend
    const rawNumber = this.labPhone.replace(/\D/g, '');
    const cleanPhone = rawNumber.startsWith('91') ? rawNumber : `91${rawNumber}`;
    const message = encodeURIComponent('Hi Thyronex Care Support, I would like to book a lab test. Please assist.');

    // Official WhatsApp Business API Landing URL
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=${cleanPhone}&text=${message}&app_absent=0`;
    window.open(whatsappUrl, '_blank');
  }

  uploadPrescription(): void {
    if (!this.labPhone) return;

    // Sanitize the phone number fetched from the backend
    const rawNumber = this.labPhone.replace(/\D/g, '');
    const cleanPhone = rawNumber.startsWith('91') ? rawNumber : `91${rawNumber}`;
    const message = encodeURIComponent('Hi Thyronex Care Support, I would like to upload the prescription for lab test. Please assist.');

    // Official WhatsApp Business API Landing URL
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=${cleanPhone}&text=${message}&app_absent=0`;
    window.open(whatsappUrl, '_blank');
  }


  handleLoginSuccess(data: { name: string, email: string }) {
    this.isLoggedIn = true;
    this.userName = data.name;
    this.userEmail = data.email;
    this.loggedInUserMobile = localStorage.getItem('userMobile') || '';
    this.loginStateChange.emit(data);
    this.closeOverlay();
  }
  

  handleBookingEmail(email: string) {
    this.userEmail = email;
    this.loginStateChange.emit({ name: this.userName, email: email });
  }

  closeOverlay() {
    this.showLoginOverlay = false;
    this.closeLogin.emit();
  }
}