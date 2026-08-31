import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() isLoggedIn = false;
  @Input() userName: string = '';
  @Input() isAdminRoute = false;
  
  @Output() triggerLogin = new EventEmitter<void>();
  @Output() triggerLogout = new EventEmitter<void>();

  // State to control mobile hamburger drawer open/close
  isMobileMenuOpen = false;

  constructor(private router: Router) {}

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  // ⭐ Direct Routing to /dashboard
  onDashboardClick(): void {
    this.closeMobileMenu();
    this.router.navigate(['/dashboard']);
  }

  onLogoClick(): void {
    this.closeMobileMenu();
    this.router.navigate(['/']);
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