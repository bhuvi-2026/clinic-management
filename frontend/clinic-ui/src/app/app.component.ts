import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeaderComponent, HomeComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // This allows the Parent to call functions inside the HomeComponent directly
  @ViewChild('homeRef') homeComponent!: HomeComponent;

  // Global authentication state
  isLoggedIn: boolean = false;
  userName: string = '';
  userEmail: string = '';

  // Trigger for the login modal
  showLoginOverlay: boolean = false;

  /**
   * Called when the Login component emits a successful login.
   * Updates state and ensures the user stays on the home view initially.
   */
  onLoginSuccess(userData: { name: string; email: string }) {
    this.isLoggedIn = true;
    this.userName = userData.name; // Stores the Full Name you added
    this.userEmail = userData.email;
    this.showLoginOverlay = false;
    
    // Ensure we are viewing the landing page after login
    if (this.homeComponent) {
      this.homeComponent.currentView = 'home';
    }
  }

  /**
   * Triggered by the "My Bookings" button in the Header.
   * Tells the HomeComponent to swap the view to the Dashboard.
   */
  handleNavigateToDashboard() {
    if (this.homeComponent) {
      this.homeComponent.switchToDashboard();
    }
  }

  /**
   * Resets the login trigger state when the modal is closed.
   * This fix ensures the login button works on the second click.
   */
  handleModalClose() {
    this.showLoginOverlay = false;
  }

  /**
   * Clears user data and resets the view to the home page.
   */
  handleLogout() {
    this.isLoggedIn = false;
    this.userName = '';
    this.userEmail = '';
    
    if (this.homeComponent) {
      this.homeComponent.currentView = 'home';
    }
    
    // Clear any stored session data if applicable
    localStorage.removeItem('user_session');
  }
}