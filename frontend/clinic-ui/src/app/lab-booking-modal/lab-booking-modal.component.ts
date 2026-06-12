import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LabPackage, LabService } from '../lab.service';

@Component({
  selector: 'app-lab-booking-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lab-booking-modal.component.html',
  styleUrls: ['./lab-booking-modal.component.css']
})
export class LabBookingModalComponent implements OnInit {
  @Input() package!: LabPackage;
  @Output() closeForm = new EventEmitter<void>();

  // State Management
  currentStep: number = 2;
  showTimePicker: boolean = false;

  // Form Data
  patientCount: number = 1;
  hardcopy: boolean = false;
  email: string = '';
  address: string = '';
  patientPhone: string = '';

  // Date & Time Selection
  availableDays: any[] = [];
  selectedDateLabel: string = '';
  selectedSlot: string = ''; // Final selection
  tempSlot: string = '';     // Selection while picker is open
  @Output() bookingComplete = new EventEmitter<string>();

  slots: string[] = [
    '06:00 - 06:30', '06:30 - 07:00', '07:30 - 08:00',
    '08:00 - 08:30', '09:00 - 09:30', '09:30 - 10:00',
    '10:00 - 10:30', '11:30 - 12:00', '12:00 - 12:30'
  ];
  isConfirmed: boolean = false;
  pincode: string = '';
  pincodeStatus: 'idle' | 'success' | 'error' = 'idle';

  constructor(private labService: LabService) { }

  ngOnInit() {
    this.generateDays();
  }

  checkPincode() {
    // Basic validation: Bengaluru pincodes mostly start with 560
    if (this.pincode.startsWith('560') && this.pincode.length === 6) {
      this.pincodeStatus = 'success';
    } else {
      this.pincodeStatus = 'error';
    }
  }

  generateDays() {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 0; i < 3; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      this.availableDays.push({
        label: i === 0 ? 'Today' : days[date.getDay()],
        month: months[date.getMonth()],
        dayNum: date.getDate(),
        fullDate: date.toDateString()
      });
    }
    this.selectedDateLabel = this.availableDays[0].fullDate;
  }

  updatePatients(val: number) {
    if (this.patientCount + val >= 1) this.patientCount += val;
  }

  selectTime() {
    if (this.tempSlot) {
      // Find the readable label for the selected date
      const dateObj = this.availableDays.find(d => d.fullDate === this.selectedDateLabel);
      const dateDisplay = dateObj ? `${dateObj.label} ${dateObj.month} ${dateObj.dayNum}` : '';

      // Combine them: "Mon May 4, 09:00 - 09:30"
      this.selectedSlot = `${dateDisplay}, ${this.tempSlot}`;
      this.showTimePicker = false;
    }
  }

  confirmBooking() {
    const bookingData = {
      package: this.package.name,
      patientCount: this.patientCount,
      schedule: this.selectedSlot,
      hardcopy: this.hardcopy,
      email: this.email,
      address: this.address,
      patientPhone: this.patientPhone
    }

    this.labService.saveLabBooking(bookingData).subscribe({
      next: () => {
        // Instead of a simple alert, emit the success
        this.bookingComplete.emit(this.package.name);
        this.isConfirmed = true;
      },
      error: (err) => {
        console.error('Failed to save appointment:', err);
        // If 400 persists, check the Java terminal for the specific field error
        alert('Database error. Booking could not be saved.');
      }
    });


  }
}