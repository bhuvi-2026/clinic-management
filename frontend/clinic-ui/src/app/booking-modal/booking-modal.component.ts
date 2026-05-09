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

    this.updateSlotString();

    // FIXED: Added userEmail and full doctor details
    const appointmentData = {
      patientName: this.patientName,
      patientPhone: this.patientPhone,
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
        this.bookingSuccess.emit(response.userEmail);
      },
      error: (err) => {
        console.error('Failed to save appointment:', err);
        alert('Database error. Booking could not be saved.');
      }
    });
  }
}