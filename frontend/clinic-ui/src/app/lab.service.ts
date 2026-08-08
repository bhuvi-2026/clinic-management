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
  private apiUrl = 'http://localhost:8080/api/lab-packages';

  constructor(private http: HttpClient) { }

  getPackages(): Observable<LabPackage[]> {
    return this.http.get<LabPackage[]>(this.apiUrl);
  }

  getLabBookingHistory(mobile: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/history?mobile=${mobile}`);
  }

  saveLabBooking(bookingData: any) {
    const headers = new HttpHeaders({
      'Clinic-Owner-Email': 'bhuvis459@gmail.com'
    });

    return this.http.post(`${this.apiUrl}/confirm-booking`, bookingData, { headers });
  }
}