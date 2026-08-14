import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    HeaderComponent, 
    FooterComponent, 
    LoginComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // Reference to active HomeComponent instance inside router-outlet
  activeHomeRef: HomeComponent | null = null;

  isLoggedIn: boolean = false;
  userName: string = '';
  userEmail: string = '';
  showLoginOverlay: boolean = false;

  // 🕒 4 Hours in milliseconds (4 hours * 60 mins * 60 secs * 1000 ms = 14,400,000 ms)
  private SESSION_DURATION_MS = 4 * 60 * 60 * 1000;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkSessionValidity();
  }

  /**
   * 🕒 Checks if a user session exists in localStorage and is under 4 hours old.
   * If valid, restores login state. If >= 4 hours old or missing, logs user out.
   */
  private checkSessionValidity(): void {
    const savedSession = localStorage.getItem('user_session');

    if (savedSession) {
      try {
        const userData = JSON.parse(savedSession);
        const currentTime = new Date().getTime();
        const loginTime = userData.loginTime || 0;

        // Verify if session is younger than 4 hours
        if (currentTime - loginTime < this.SESSION_DURATION_MS) {
          this.isLoggedIn = true;
          this.userName = userData.name || 'User';
          this.userEmail = userData.email || '';
          return;
        }
      } catch (e) {
        console.error('Error parsing stored session:', e);
      }
    }

    // Session is invalid or expired (> 4 hours) -> Force logout
    this.handleLogout();
  }

  /**
   * 🔄 Runs whenever a component loads inside <router-outlet>
   */
  onRouteActivate(componentRef: any): void {
    if (componentRef) {
      // Store reference if current loaded route is HomeComponent
      if (componentRef instanceof HomeComponent) {
        this.activeHomeRef = componentRef;
      } else {
        this.activeHomeRef = null;
      }

      // Sync login credentials to child route component
      componentRef.isLoggedIn = this.isLoggedIn;
      componentRef.userName = this.userName;
      componentRef.userEmail = this.userEmail;

      // Catch login success emitted from child components
      if (componentRef.loginStateChange) {
        componentRef.loginStateChange.subscribe((data: { name: string; email: string }) => {
          this.onLoginSuccess(data);
        });
      }

      // Catch modal close requests
      if (componentRef.closeLogin) {
        componentRef.closeLogin.subscribe(() => {
          this.showLoginOverlay = false;
        });
      }
    }
  }

  /**
   * 💾 Called upon successful login. Stores session timestamp for 4-hour validity.
   */
  onLoginSuccess(userData: { name: string; email: string }) {
    this.isLoggedIn = true;
    this.userName = userData.name || 'User';
    this.userEmail = userData.email || '';
    this.showLoginOverlay = false;

    // Save session with current timestamp
    const sessionPayload = {
      name: this.userName,
      email: this.userEmail,
      loginTime: new Date().getTime() // Saves exact login timestamp
    };
    localStorage.setItem('user_session', JSON.stringify(sessionPayload));

    // Update active HomeComponent state
    if (this.activeHomeRef) {
      this.activeHomeRef.isLoggedIn = true;
      this.activeHomeRef.userName = this.userName;
      this.activeHomeRef.userEmail = this.userEmail;
    }
  }

  handleModalClose(): void {
    this.showLoginOverlay = false;
  }

  /**
   * 🔒 Clears local storage and resets user login session
   */
  handleLogout(): void {
    this.isLoggedIn = false;
    this.userName = '';
    this.userEmail = '';
    localStorage.removeItem('user_session');
    sessionStorage.removeItem('user_session');

    if (this.activeHomeRef) {
      this.activeHomeRef.currentView = 'home';
    }

    if (window.location.pathname.includes('test-packages')) {
      this.router.navigate(['/']);
    }
  }

  /**
   * 🎯 Handles "My Bookings" click from Header
   */
  handleNavigateToDashboard(): void {
    if (this.activeHomeRef) {
      this.activeHomeRef.switchToDashboard();
    } else {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          if (this.activeHomeRef) {
            this.activeHomeRef.switchToDashboard();
          }
        }, 100);
      });
    }
  }
}