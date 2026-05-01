import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// This interface matches our Java Doctor model
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
  // This is the URL of your Spring Boot backend
  private apiUrl = 'http://localhost:8080/api/doctors';
  private appointmentUrl = 'http://localhost:8080/api/appointments';

  constructor(private http: HttpClient) { }

  // Method to fetch the list of doctors from the backend
  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.apiUrl);
  }

  //to save appointment data to the database
  saveAppointment(appointmentData: any): Observable<any> {
    return this.http.post<any>(this.appointmentUrl, appointmentData);
  }
}