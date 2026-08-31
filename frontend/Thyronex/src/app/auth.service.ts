import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //private baseUrl = `${environment.apiUrl}/auth`;
  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  requestOtp(mobileNumber: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/request-otp`, { mobileNumber });
  }

  verifyOtp(mobileNumber: string, otp: string): Observable<any> {
    return this.http.post<{success: boolean, message: string}>(`${this.baseUrl}/verify-otp`, { 
      mobileNumber, 
      otp 
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred!';
        
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Client Error: ${error.error.message}`;
        } else {
          errorMessage = error.error?.message || `Server Error Code: ${error.status}`;
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}