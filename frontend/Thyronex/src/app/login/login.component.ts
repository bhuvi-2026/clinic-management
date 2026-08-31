import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  @Output() loginSuccess = new EventEmitter<{ name: string, email: string }>();
  @Output() closeLogin = new EventEmitter<void>();

  username: string = '';
  mobileNumber: string = '';
  otp: string = '';
  isOtpSent = false;
  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService) { }

  // Check if form is valid before submitting
  isRequestOtpValid(): boolean {
    const isNameValid = !!this.username && this.username.trim().length > 0 && /^[a-zA-Z\s]+$/.test(this.username);
    const isMobileValid = !!this.mobileNumber && /^[6-9][0-9]{9}$/.test(this.mobileNumber);
    return isNameValid && isMobileValid && !this.isLoading;
  }

  isVerifyOtpValid(): boolean {
    return !!this.otp && this.otp.trim().length === 6 && !this.isLoading;
  }

  onRequestOtp(): void {
    if (!this.isRequestOtpValid()) {
      if (!this.username || !this.username.trim()) {
        this.errorMessage = 'Please enter your full name';
      } else if (!this.mobileNumber || this.mobileNumber.length !== 10) {
        this.errorMessage = 'Please enter a valid 10-digit mobile number';
      }
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.authService.requestOtp(this.mobileNumber).subscribe({
      next: () => {
        this.isOtpSent = true;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to send OTP';
        this.isLoading = false;
      }
    });
  }

  // Allow Enter (code 13), Backspace, Tab, and letter characters
  blockNumbers(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onRequestOtp();
      return;
    }
    const pattern = /[a-zA-Z ]/;
    if (!pattern.test(event.key) && event.key.length === 1) {
      event.preventDefault();
    }
  }

  // Allow Enter (code 13), Backspace, Tab, and digit characters
  blockAlphabets(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onRequestOtp();
      return;
    }
    const pattern = /[0-9]/;
    if (!pattern.test(event.key) && event.key.length === 1) {
      event.preventDefault();
    }
  }

  onOtpKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onVerifyOtp();
    }
  }

  onVerifyOtp(): void {
    if (!this.isVerifyOtpValid()) {
      this.errorMessage = 'Please enter a valid 6-digit OTP';
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    
    this.authService.verifyOtp(this.mobileNumber, this.otp).subscribe({
      next: (res: any) => {
        if (res.success) {
          const patientName = this.username.trim() || 'User';
          const patientEmail = res.userEmail || '';

          const sessionPayload = {
            name: patientName,
            mobile: this.mobileNumber,
            email: patientEmail,
            loginTime: new Date().getTime()
          };
          localStorage.setItem('user_session', JSON.stringify(sessionPayload));
          localStorage.setItem('userMobile', this.mobileNumber);
          localStorage.setItem('userName', patientName);

          this.loginSuccess.emit({
            name: patientName,
            email: patientEmail
          });
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Invalid OTP entered. Please try again.';
        this.otp = '';
        this.isLoading = false;
      }
    });
  }
}