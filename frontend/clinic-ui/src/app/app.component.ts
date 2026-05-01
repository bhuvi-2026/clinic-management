import { Component } from '@angular/core';
import { HealthHomeComponent } from './health-home/health-home.component';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HealthHomeComponent, LoginComponent], // Load the parent component
  templateUrl: './app.component.html', // Display it
  styleUrls: ['./app.component.css'] // You can delete app.component.css if you want!
})
export class AppComponent {
  title = 'Doctor Consultation Platform';
  // State management
  isLoggedIn: boolean = false;
  showLoginOverlay: boolean = false;

  handleLoginSuccess() {
    this.isLoggedIn = true;
    this.showLoginOverlay = false;
    console.log('User is now logged in');
  }

  logout() {
    this.isLoggedIn = false;
    console.log('User logged out');
  }
}