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
    this.isLoading = true;
    this.authService.requestOtp(this.mobileNumber).subscribe({
      next: () => {
        this.isOtpSent = true;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }
  blockNumbers(event: any) {
    const pattern = /[a-zA-Z ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  // Block alphabets and symbols in the Mobile field
  blockAlphabets(event: any) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onVerifyOtp() {
    this.isLoading = true;
    this.authService.verifyOtp(this.mobileNumber, this.otp).subscribe({
      next: (res) => {
        if (res.success) {
          localStorage.setItem('userMobile', this.mobileNumber);
          localStorage.setItem('userName', this.username);
          this.loginSuccess.emit({
            name: this.username,
            email: res.userEmail
          });
        }
        this.isLoading = false;
      },
      error: (err: Error) =>  {
        console.log("Captured error string:", err.message);
        this.errorMessage =err.message;
        this.otp = '';
        console.log("errormsg", this.errorMessage);
        this.isLoading = false;
      }
    });
  }
}