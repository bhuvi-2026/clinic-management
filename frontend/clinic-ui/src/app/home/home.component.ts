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

  // Use a string for flexibility in templates
  currentView: 'home' | 'tests' | 'dashboard' = 'home';

  // This is the function the parent calls
  switchToDashboard() {
    this.currentView = 'dashboard';
    document.body.style.overflow = 'hidden';
  }
  handleBackToHome() {
    this.currentView = 'home';
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  }

  handleLoginSuccess(data: { name: string, email: string }) {
    this.loginStateChange.emit(data);
    this.closeOverlay();
    // Logic: stay on home page after login per your client requirements
  }
  handleBookingEmail(email: string) {
    console.log("Email id here also", email);
    this.userEmail = email; // Update the local input property
    // Also notify the App Component so the header/state stays in sync
    this.loginStateChange.emit({ name: this.userName, email: email });
  }

  scrollToDoctors() {
    this.currentView = 'home';
    this.smoothScroll('doctor-list');
  }

  scrollToLab() {
    this.currentView = 'tests';
    this.smoothScroll('lab-list');
  }

  private smoothScroll(id: string) {
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  }

  closeOverlay() {
    this.showLoginOverlay = false;
    this.closeLogin.emit();
  }
}