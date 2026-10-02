import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabTestsComponent } from "../lab-tests/lab-tests.component";
import { LoginComponent } from "../login/login.component";
import { UserDashboardComponent } from "../user-dashboard/user-dashboard.component";
import { LabService } from '../lab.service';
import { ExploreHealthConcernsComponent } from '../explore-health-concerns/explore-health-concerns.component';
import { AdminComponent } from "../admin/admin.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LabTestsComponent, ExploreHealthConcernsComponent, LoginComponent, UserDashboardComponent, AdminComponent],
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

  // Getter that extracts pure digits and leading plus for native dialer URI
  get sanitizedPhone(): string {
    if (!this.labPhone) return '';
    return this.labPhone.replace(/[^0-9+]/g, '');
  }

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
        const fourHoursInMillis = 4 * 60 * 60 * 1000;

        if (session.loginTime && (currentTime - session.loginTime < fourHoursInMillis)) {
          this.isLoggedIn = true;
          this.userName = session.name || 'User';
          this.userEmail = session.email || '';
          this.loggedInUserMobile = session.mobile || '';

          this.loginStateChange.emit({
            name: this.userName,
            email: this.userEmail
          });
        } else {
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

  // ⭐ Direct native phone dialer for mobile users, modal fallback for desktop
 onPhoneBooking(): void {
    // 1. Precise touch-enabled mobile phone detection
    const isMobilePhone = /iPhone|Android.*Mobile|webOS|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
      && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
      && window.innerWidth <= 576;

    if (isMobilePhone) {
      // Direct call on smartphones only
      const targetPhone = this.sanitizedPhone || '+918310351368';
      window.location.href = `tel:${targetPhone}`;
    } else {
      // Shows the clean in-app modal on Laptops, Desktops, and Tablets
      this.showPhoneModal = true;
    }
  }

  closePhoneModal(): void {
    this.showPhoneModal = false;
  }

  onWhatsAppBooking(): void {
    if (!this.labPhone) return;

    const rawNumber = this.labPhone.replace(/\D/g, '');
    const cleanPhone = rawNumber.startsWith('91') ? rawNumber : `91${rawNumber}`;
    const message = encodeURIComponent('Hi Thyronex Care Support, I would like to book a lab test. Please assist.');
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=${cleanPhone}&text=${message}&app_absent=0`;
    window.open(whatsappUrl, '_blank');
  }

  uploadPrescription(): void {
    if (!this.labPhone) return;

    const rawNumber = this.labPhone.replace(/\D/g, '');
    const cleanPhone = rawNumber.startsWith('91') ? rawNumber : `91${rawNumber}`;
    const message = encodeURIComponent('Hi Thyronex Care Support, I would like to upload the prescription for lab test. Please assist.');
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