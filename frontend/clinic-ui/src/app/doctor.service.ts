import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
    const headers = new HttpHeaders({ 
      'Clinic-Owner-Email': 'bhuvis459@gmail.com'// Replace with your actual owner email
    });
    return this.http.post(this.appointmentUrl, appointmentData, { headers });
  }

  getBookingHistory(mobile: string): Observable<any[]> {
   // Use HttpParams to send the email as a query parameter (?email=...)
  const params = new HttpParams().set('mobile', mobile);
  
  // The URL remains professional, the email is hidden in the parameters
  return this.http.get<any[]>(`${this.appointmentUrl}/history`, { params });
}
}