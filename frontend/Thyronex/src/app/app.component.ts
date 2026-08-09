import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component'; // Ensure this is imported

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    HeaderComponent, 
    FooterComponent, 
    LoginComponent // ADD LoginComponent HERE
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isLoggedIn: boolean = false;
  userName: string = '';
  userEmail: string = '';
  showLoginOverlay: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Check if session exists on page reload/refresh
    const savedSession = localStorage.getItem('user_session');
    if (savedSession) {
      const userData = JSON.parse(savedSession);
      this.isLoggedIn = true;
      this.userName = userData.name;
      this.userEmail = userData.email;
    } else {
      // If not logged in on refresh -> Ensure redirect to Home page
      this.isLoggedIn = false;
      if (window.location.pathname.includes('test-packages')) {
        this.router.navigate(['/']);
      }
    }
  }

  // Triggered when user completes login successfully in app-login modal
  onLoginSuccess(userData: { name: string; email: string }) {
    this.isLoggedIn = true;
    this.userName = userData.name;
    this.userEmail = userData.email;
    this.showLoginOverlay = false; // Closes login modal
  }

  // Closes the login modal on close button click
  handleModalClose() {
    this.showLoginOverlay = false;
  }

  // Handle logout
  handleLogout() {
    this.isLoggedIn = false;
    this.userName = '';
    this.userEmail = '';
    this.router.navigate(['/']);
  }

  handleNavigateToDashboard() {
    // Navigate or switch view to dashboard
  }
}