import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorService, Doctor } from '../doctor.service';
import { BookingModalComponent } from '../booking-modal/booking-modal.component'; // Import the child

@Component({
  selector: 'app-health-home',
  standalone: true,
  // Notice we add BookingModalComponent to the imports array here!
  imports: [CommonModule, BookingModalComponent], 
  templateUrl: './health-home.component.html',
  styleUrls: ['./health-home.component.css']
})
export class HealthHomeComponent implements OnInit {
  doctors: Doctor[] = [];
  @Input() isLoggedIn: boolean = false;
  @Output() loginRequired = new EventEmitter<void>();
  selectedDoctor: Doctor | null = null; // Keeps track of who was clicked

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.doctorService.getDoctors().subscribe({
      next: (data) => {
        this.doctors = data;
      },
      error: (err) => {
        console.error('Error fetching doctors:', err);
      }
    });
  }

  // Triggers when a user clicks "Book Consultation"
  handleBookingClick(doctor: Doctor) {
    if (this.isLoggedIn) {
      this.selectedDoctor = doctor; // Open the booking modal
    } else {
      // If not logged in, tell the parent to show the login overlay
      this.loginRequired.emit(); 
    }
  }


  // Triggers when the child component sends the "closeForm" event
  closeModal() {
    this.selectedDoctor = null;
  }
}