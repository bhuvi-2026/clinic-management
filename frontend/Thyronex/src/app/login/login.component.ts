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

  onRequestOtp() {
    if (!this.mobileNumber || this.mobileNumber.length !== 10) {
      this.errorMessage = 'Please enter a valid 10-digit mobile number';
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

  blockNumbers(event: any) {
    const pattern = /[a-zA-Z ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  blockAlphabets(event: any) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onVerifyOtp() {
    if (!this.otp || this.otp.length !== 6) {
      this.errorMessage = 'Please enter the 6-digit OTP';
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    
    this.authService.verifyOtp(this.mobileNumber, this.otp).subscribe({
      next: (res: any) => {
        if (res.success) {
          const patientName = this.username.trim() || 'User';
          const patientEmail = res.userEmail || '';

          // =========================================================================
          // 🕒 4-HOUR PERSISTENT SESSION (COMMENTED OUT FOR REFRESH LOGOUT TESTING)
          // =========================================================================
          
          const sessionPayload = {
            name: patientName,
            mobile: this.mobileNumber,
            email: patientEmail,
            loginTime: new Date().getTime()
          };
          localStorage.setItem('user_session', JSON.stringify(sessionPayload));
          

          localStorage.setItem('userMobile', this.mobileNumber);
          localStorage.setItem('userName', patientName);
          // Emit login success to update parent component state in memory
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