import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Doctor {
  id?: number;
  name: string;
  specialization: string;
  qualification: string;
  consultationFee: number;
}

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = 'http://localhost:8080/api/doctors';
  private appointmentUrl = 'http://localhost:8080/api/appointments';

  constructor(private http: HttpClient) { }

  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.apiUrl);
  }

  // Header is removed; backend will use the value set in your CMD
  saveAppointment(appointmentData: any): Observable<any> {
    return this.http.post(this.appointmentUrl, appointmentData);
  }

  getBookingHistory(email: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.appointmentUrl}/history/${email}`);
  }
}