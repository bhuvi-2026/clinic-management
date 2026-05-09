import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorService, Doctor } from '../doctor.service';
import { BookingModalComponent } from '../booking-modal/booking-modal.component';

@Component({
  selector: 'app-health-home',
  standalone: true,
  imports: [CommonModule, BookingModalComponent],
  templateUrl: './health-home.component.html',
  styleUrls: ['./health-home.component.css']
})
export class HealthHomeComponent implements OnInit {
  doctors: Doctor[] = [];
  @Input() isLoggedIn: boolean = false;
  @Input() userEmail: string = ''; // NEW: Receive email from AppComponent
  @Output() loginRequired = new EventEmitter<void>();
  @Output() bookingFinished = new EventEmitter<string>();

  selectedDoctor: Doctor | null = null;

  constructor(private doctorService: DoctorService) { }

  ngOnInit(): void {
    this.doctorService.getDoctors().subscribe({
      next: (data) => { this.doctors = data; },
      error: (err) => { console.error('Error fetching doctors:', err); }
    });
  }


  onBookingComplete(email: string) {
    console.log("Email id here", email);
    this.bookingFinished.emit(email); // Passing it up to AppComponent
  }
  handleBookingClick(doctor: Doctor) {
    if (this.isLoggedIn) {
      this.selectedDoctor = doctor;
    } else {
      this.loginRequired.emit();
    }
  }

  closeModal() {
    this.selectedDoctor = null;
  }
}