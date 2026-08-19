import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
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
  activeHomeRef: HomeComponent | null = null;
  isLoggedIn: boolean = false;
  userName: string = '';
  userEmail: string = '';
  loggedInUserMobile: string = '';
  showLoginOverlay: boolean = false;
  isAdminRoute: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // ⭐ Restore 4-Hour Session on Initial Load / Page Refresh
    this.restoreSession();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isAdminRoute = event.urlAfterRedirects.includes('/admin');
      });
  }

  // =========================================================================
  // 🕒 RESTORE 4-HOUR SESSION CHECK
  // =========================================================================
  restoreSession(): void {
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
          this.loggedInUserMobile = session.mobile || localStorage.getItem('userMobile') || '';
        } else {
          // Session expired after 4 hours
          this.handleLogout();
        }
      } catch (e) {
        this.handleLogout();
      }
    }
  }

  onRouteActivate(componentRef: any): void {
    if (componentRef) {
      if (componentRef instanceof HomeComponent) {
        this.activeHomeRef = componentRef;
      } else {
        this.activeHomeRef = null;
      }

      componentRef.isLoggedIn = this.isLoggedIn;
      componentRef.userName = this.userName;
      componentRef.userEmail = this.userEmail;
      componentRef.loggedInUserMobile = this.loggedInUserMobile;

      if (componentRef.loginStateChange) {
        componentRef.loginStateChange.subscribe((data: { name: string; email: string }) => {
          this.onLoginSuccess(data);
        });
      }

      if (componentRef.closeLogin) {
        componentRef.closeLogin.subscribe(() => {
          this.showLoginOverlay = false;
        });
      }
    }
  }

  onLoginSuccess(userData: { name: string; email: string }) {
    this.isLoggedIn = true;
    this.userName = userData.name || 'User';
    this.userEmail = userData.email || '';
    this.loggedInUserMobile = localStorage.getItem('userMobile') || '';
    this.showLoginOverlay = false;

    if (this.activeHomeRef) {
      this.activeHomeRef.isLoggedIn = true;
      this.activeHomeRef.userName = this.userName;
      this.activeHomeRef.userEmail = this.userEmail;
      this.activeHomeRef.loggedInUserMobile = this.loggedInUserMobile;
    }
  }

  handleModalClose(): void {
    this.showLoginOverlay = false;
  }

  handleLogout(): void {
    this.isLoggedIn = false;
    this.userName = '';
    this.userEmail = '';
    this.loggedInUserMobile = '';
    localStorage.removeItem('user_session');
    localStorage.removeItem('userMobile');
    localStorage.removeItem('userName');

    if (this.activeHomeRef) {
      this.activeHomeRef.currentView = 'home';
      this.activeHomeRef.isLoggedIn = false;
      this.activeHomeRef.userName = '';
      this.activeHomeRef.userEmail = '';
      this.activeHomeRef.loggedInUserMobile = '';
    }

    if (window.location.pathname.includes('test-packages')) {
      this.router.navigate(['/']);
    }
  }

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