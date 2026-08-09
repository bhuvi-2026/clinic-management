import { Component, Input, Output, EventEmitter } from '@angular/core';
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
export class HomeComponent {
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
    this.isLoggedIn = true; // Update local state
    this.loginStateChange.emit(data);
    this.closeOverlay();
    // Stays on Home page after login as per requirement!
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