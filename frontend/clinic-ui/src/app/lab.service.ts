import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LabPackage {
  id: number;
  name: string;
  testCount: number;
  description: string;
  price: number;
  originalPrice?: number;
  fastingRequired: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LabService {
  private apiUrl = 'http://localhost:8080/api/lab-packages'; // Your Spring Boot endpoint

  constructor(private http: HttpClient) { }

  getPackages(): Observable<LabPackage[]> {
    return this.http.get<LabPackage[]>(this.apiUrl);
  }
  saveLabBooking(bookingData: any) {
    const headers = new HttpHeaders({
      // Same logic as your doctor flow
      'Clinic-Owner-Email': 'bhuvis459@gmail.com' 
    });

    return this.http.post(`${this.apiUrl}/confirm-booking`, bookingData, { headers });
  }
}