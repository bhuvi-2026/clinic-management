import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Doctor, DoctorService } from '../doctor.service';
import { LabPackage } from '../lab.service';

@Component({
  selector: 'app-booking-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-modal.component.html',
  styleUrls: ['./booking-modal.component.css']
})
export class BookingModalComponent {
  @Input() doctor!: Doctor;
  @Input() labPackage?: LabPackage;
  @Input() userEmail: string = ''; // NEW: Input to receive logged-in user email

  @Output() closeForm = new EventEmitter<void>();
  @Output() bookingSuccess = new EventEmitter<string>();

  patientName: string = '';
  patientPhone: string = '';
  patientEmail: string = '';
  isBookingLoading: boolean = false;
  isConfirmed: boolean = false;
  selectedSlot: string = '';
  bookingDate: string = '';
  bookingTime: string = '';
  minDate: string = new Date().toISOString().split('T')[0];

  constructor(private doctorService: DoctorService) { }

  get itemName(): string {
    return this.doctor ? this.doctor.name : (this.labPackage ? this.labPackage.name : '');
  }
  
  close() {
  // Reset body scroll manually just in case
  document.body.style.overflow = 'auto';
  this.closeForm.emit();
}

  updateSlotString() {
    if (this.bookingDate && this.bookingTime) {
      this.selectedSlot = `${this.bookingDate} ${this.bookingTime}`;
    }
  }

  submitBooking() {
    if (!this.patientName || !this.patientEmail || !this.patientPhone || !this.bookingDate || !this.bookingTime) {
      alert('Please fill in all details and preferred date/time, including your email for the Zoom link.');
      return;
    }
    let sanitizedPhone = this.patientPhone.replace(/\D/g, ''); // Remove all non-digits

    this.updateSlotString();

    this.isBookingLoading = true;

    // FIXED: Added userEmail and full doctor details
    const appointmentData = {
      patientName: this.patientName,
      userMobile: sanitizedPhone,
      appointmentSlot: this.selectedSlot,
      userEmail: this.patientEmail, // This allows the dashboard to find the booking
      doctor: {
        id: this.doctor.id,
        name: this.doctor.name // Passing name ensures Zoom service works correctly
      }
    };

    this.doctorService.saveAppointment(appointmentData).subscribe({
      next: (response) => {
        console.log('Booking saved successfully', response);
        this.isConfirmed = true;
        this.isBookingLoading = false;
        localStorage.setItem('userEmail', this.patientEmail);
        this.bookingSuccess.emit(response.userEmail);
        document.body.style.overflow = 'auto';
      
      // Optional: Auto-close after 3 seconds
      setTimeout(() => this.close(), 3000);
      },
      error: (err) => {
        this.isBookingLoading = false;
        document.body.style.overflow = 'auto';
        console.error('Failed to save appointment:', err);
        alert('Database error. Booking could not be saved.');
      }
    });
  }
}