import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() isLoggedIn = false;
  @Input() userName: string = '';
  @Input() isAdminRoute = false;
  
  @Output() triggerLogin = new EventEmitter<void>();
  @Output() triggerDashboard = new EventEmitter<void>();
  @Output() triggerLogout = new EventEmitter<void>();

  // State to control mobile hamburger drawer open/close
  isMobileMenuOpen = false;

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  onDashboardClick(): void {
    this.closeMobileMenu();
    this.triggerDashboard.emit();
  }

  onLogoutClick(): void {
    this.closeMobileMenu();
    this.triggerLogout.emit();
  }

  onLoginClick(): void {
    this.closeMobileMenu();
    this.triggerLogin.emit();
  }
}