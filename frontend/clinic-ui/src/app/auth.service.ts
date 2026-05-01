import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // This matches the @RequestMapping("/api/auth") in your Spring Boot controller
  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  /**
   * Step 1: Request a 6-digit OTP for the given mobile number
   */
  requestOtp(mobileNumber: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/request-otp`, { mobileNumber });
  }

  /**
   * Step 2: Verify the OTP entered by the user
   */
  verifyOtp(mobileNumber: string, otp: string): Observable<any> {
    return this.http.post<{success: boolean, message: string}>(`${this.baseUrl}/verify-otp`, { 
      mobileNumber, 
      otp 
    });
  }
}