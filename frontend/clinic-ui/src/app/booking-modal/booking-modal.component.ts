import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Doctor, DoctorService } from '../doctor.service';

@Component({
  selector: 'app-booking-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-modal.component.html',
  styleUrls: ['./booking-modal.component.css']
})
export class BookingModalComponent {
  // @Input allows the parent to pass data IN
  @Input() doctor!: Doctor; 
  
  // @Output allows this component to send events OUT to the parent
  @Output() closeForm = new EventEmitter<void>(); 

  patientName: string = '';
  patientPhone: string = '';
  isConfirmed: boolean = false;
  selectedSlot: string = '';
  bookingDate: string = '';
  bookingTime: string = '';
  minDate: string = new Date().toISOString().split('T')[0];

  constructor(private doctorService: DoctorService) {}
  
  close() {
    this.closeForm.emit(); // Tells the parent to close the modal
  }

  updateSlotString() {
    if (this.bookingDate && this.bookingTime) {
      this.selectedSlot = `${this.bookingDate} ${this.bookingTime}`;
    }
  }
  submitBooking() {
    if (!this.patientName || !this.patientPhone || !this.bookingDate || !this.bookingTime) {
      alert('Please fill in all details and preferred date/time.');
      return;
    }

    const appointmentData = {
      patientName: this.patientName,
      patientPhone: this.patientPhone,
      appointmentSlot: this.selectedSlot,
      doctor: { id: this.doctor.id } // Sending the doctor ID to link the relationship
    };

    // 2. Save to Database via API
    this.doctorService.saveAppointment(appointmentData).subscribe({
      next: (response) => {
        console.log('booking saved successfully', response);
        this.isConfirmed = true;
        
        // 3. ONLY after successful save, open WhatsApp
        
      },
      error: (err) => {
        console.error('Failed to save appointment:', err);
        alert('Database error. Booking could not be saved.');
      }
    });
  }


  
}