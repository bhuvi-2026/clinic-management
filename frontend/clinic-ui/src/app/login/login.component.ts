import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @Output() loginSuccess = new EventEmitter<void>();
  @Output() closeLogin = new EventEmitter<void>();

  mobileNumber: string = '';
  otp: string = '';
  isOtpSent: boolean = false;
  isLoading: boolean = false;

  constructor(private authService: AuthService) {}

  // Step 1: Request OTP from Backend
  onRequestOtp() {
    if (this.mobileNumber.length !== 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    this.isLoading = true;
    
    // For now, we simulate a successful API call
    console.log('Requesting OTP for:', this.mobileNumber);
    this.authService.requestOtp(this.mobileNumber).subscribe({
      next: (response) => {
        console.log('OTP Requested');
        this.isOtpSent = true;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        alert('Failed to send OTP. Check if Backend is running.');
        this.isLoading = false;
      }
    });
  }

  // Step 2: Verify OTP with Backend
  onVerifyOtp() {
    this.isLoading = true;
    this.authService.verifyOtp(this.mobileNumber, this.otp).subscribe({
      next: (res) => {
        if (res.success) {
          this.loginSuccess.emit(); // Closes overlay & updates navbar
        } else {
          alert('Invalid OTP. Please check your console/terminal.');
        }
        this.isLoading = false;
      },
      error: (err) => {
        alert('Verification error.');
        this.isLoading = false;
      }
    });
  }
}