import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabTestsComponent } from "../lab-tests/lab-tests.component";
import { LoginComponent } from "../login/login.component";
import { UserDashboardComponent } from "../user-dashboard/user-dashboard.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LabTestsComponent, LoginComponent, UserDashboardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  @Input() isLoggedIn = false;
  @Input() userName = '';
  @Input() userEmail = '';
  @Input() loggedInUserMobile = '';

  showLoginOverlay = false;

  @Input() set loginTrigger(val: boolean) {
    if (val) this.showLoginOverlay = true;
  }

  @Output() loginStateChange = new EventEmitter<{ name: string, email: string }>();
  @Output() closeLogin = new EventEmitter<void>();

  currentView: 'home' | 'tests' | 'dashboard' = 'home';

  // =========================================================================
  // 🕒 4-HOUR SESSION AUTO-RESTORE ON LOAD / REFRESH
  // =========================================================================
  ngOnInit(): void {
    this.restoreSessionIfValid();
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
    window.location.href = 'tel:+919876543210';
  }

  onQuickOrder(): void {
    console.log('Quick Order clicked');
  }

  onWhatsAppBooking(): void {
    const phone = '919876543210';
    const message = encodeURIComponent('Hello, I would like to book a lab test.');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
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