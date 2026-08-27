import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LabPackage, LabService } from '../lab.service';

export interface PatientInfo {
  name: string;
  age: number | null;
  gender: 'Male' | 'Female' | 'Other';
}

export interface CalendarDay {
  date: Date | null;
  dayNumber: number | null;
  isPast: boolean;
  isToday: boolean;
}

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
  @Output() bookingComplete = new EventEmitter<string>();

  currentStep: number = 1;
  showTimePicker: boolean = false;
  isSubmitting: boolean = false;
  isCheckingPincode: boolean = false;

  // Multi-Patient array
  patientCount: number = 1;
  patients: PatientInfo[] = [
    { name: '', age: null, gender: 'Male' }
  ];

  // Shared Contact Data
  patientPhone: string = '';
  email: string = '';
  emailError: boolean = false;
  address: string = '';
  hardcopy: boolean = false;

  // Pincode validation state
  pincode: string = '';
  pincodeStatus: 'idle' | 'success' | 'error' = 'idle';
  serviceLocation: string = '';
  pincodeErrorMessage: string = '';

  // Calendar & Date State
  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();
  calendarDays: CalendarDay[] = [];
  selectedDate: Date = new Date();

  // Distinct AM & PM Slots
  morningSlots: string[] = [
    '06:00 AM - 06:30 AM',
    '06:30 AM - 07:00 AM',
    '07:00 AM - 07:30 AM',
    '07:30 AM - 08:00 AM',
    '08:00 AM - 08:30 AM',
    '08:30 AM - 09:00 AM',
    '09:00 AM - 09:30 AM',
    '09:30 AM - 10:00 AM',
    '10:00 AM - 10:30 AM'
  ];

  eveningSlots: string[] = [
    '04:00 PM - 04:30 PM',
    '05:00 PM - 05:30 PM',
    '06:00 PM - 06:30 PM',
    '07:00 PM - 07:30 PM'
  ];

  selectedSlot: string = '';
  tempSlot: string = '';
  isConfirmed: boolean = false;

  constructor(
    private labService: LabService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.selectedDate = new Date();
    this.buildCalendar();

    // Default primary patient to logged-in user
    const defaultName = localStorage.getItem('userName') || '';
    this.patients[0].name = defaultName;
    this.patientPhone = localStorage.getItem('userMobile') || '';
  }

  openCalendarModal() {
    this.buildCalendar();
    this.showTimePicker = true;
  }

  // Generate Month Grid with Past Days Disabled
  buildCalendar() {
    this.calendarDays = [];
    const firstDayIndex = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const totalDays = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Padding for starting weekday
    for (let i = 0; i < firstDayIndex; i++) {
      this.calendarDays.push({ date: null, dayNumber: null, isPast: true, isToday: false });
    }

    // Days of the month
    for (let day = 1; day <= totalDays; day++) {
      const d = new Date(this.currentYear, this.currentMonth, day);
      d.setHours(0, 0, 0, 0);

      const isPast = d.getTime() < today.getTime();
      const isToday = d.getTime() === today.getTime();

      this.calendarDays.push({
        date: d,
        dayNumber: day,
        isPast: isPast,
        isToday: isToday
      });
    }
  }

  changeMonth(direction: number) {
    this.currentMonth += direction;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.buildCalendar();
  }

  isCurrentMonthSelected(): boolean {
    const today = new Date();
    return this.currentYear === today.getFullYear() && this.currentMonth === today.getMonth();
  }

  getMonthName(): string {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[this.currentMonth];
  }

  onSelectDate(date: Date | null) {
    if (!date) return;
    this.selectedDate = date;
  }

  isSelectedDate(date: Date | null): boolean {
    if (!date || !this.selectedDate) return false;
    return (
      date.getDate() === this.selectedDate.getDate() &&
      date.getMonth() === this.selectedDate.getMonth() &&
      date.getFullYear() === this.selectedDate.getFullYear()
    );
  }

  formatSelectedDate(): string {
    if (!this.selectedDate) return '';
    return this.selectedDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  confirmDateTimeSelection() {
    if (this.tempSlot && this.selectedDate) {
      const dateStr = this.selectedDate.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      this.selectedSlot = `${dateStr}, ${this.tempSlot}`;
      this.showTimePicker = false;
    }
  }

  updatePatients(val: number) {
    const newCount = this.patientCount + val;
    if (newCount >= 1 && newCount <= 6) {
      this.patientCount = newCount;
      while (this.patients.length < this.patientCount) {
        this.patients.push({ name: '', age: null, gender: 'Male' });
      }
      while (this.patients.length > this.patientCount) {
        this.patients.pop();
      }
    }
  }

  validateEmail(): void {
    const trimmed = this.email.trim();
    if (!trimmed) {
      this.emailError = false;
      return;
    }
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.emailError = !emailPattern.test(trimmed);
  }

  onPincodeInput() {
    this.pincodeStatus = 'idle';
    this.pincodeErrorMessage = '';
    this.serviceLocation = '';
  }

  checkPincode() {
    const pin = this.pincode.trim();
    if (pin.length !== 6) {
      this.pincodeStatus = 'error';
      this.pincodeErrorMessage = 'Please enter a valid 6-digit pincode';
      return;
    }

    this.isCheckingPincode = true;
    this.pincodeStatus = 'idle';

    this.http.get<any[]>(`https://api.postalpincode.in/pincode/${pin}`).subscribe({
      next: (response) => {
        this.isCheckingPincode = false;

        if (response && response[0] && response[0].Status === 'Success' && response[0].PostOffice?.length > 0) {
          const firstOffice = response[0].PostOffice[0];
          const state = (firstOffice.State || '').toLowerCase();
          const district = (firstOffice.District || '').toLowerCase();
          const areaName = firstOffice.Name || '';

          const isBengaluru = district.includes('bangalore') || district.includes('bengaluru');
          const isHassan = district.includes('hassan');

          if (state === 'karnataka' && (isBengaluru || isHassan)) {
            this.pincodeStatus = 'success';
            this.serviceLocation = isBengaluru ? `Bengaluru (${areaName})` : `Hassan (${areaName})`;
          } else {
            this.pincodeStatus = 'error';
            this.pincodeErrorMessage = `Service available in Bengaluru & Hassan only (Your area: ${firstOffice.District})`;
          }
        } else {
          this.pincodeStatus = 'error';
          this.pincodeErrorMessage = 'Invalid or non-existent pincode';
        }
      },
      error: () => {
        this.isCheckingPincode = false;
        const num = parseInt(pin, 10);
        if ((num >= 560001 && num <= 560114) || (num >= 573101 && num <= 573228)) {
          this.pincodeStatus = 'success';
          this.serviceLocation = num >= 573000 ? 'Hassan' : 'Bengaluru';
        } else {
          this.pincodeStatus = 'error';
          this.pincodeErrorMessage = 'Service unavailable in this pincode';
        }
      }
    });
  }

  blockNonNumbers(event: any) {
    const pattern = /[0-9]/;
    if (!pattern.test(String.fromCharCode(event.charCode))) {
      event.preventDefault();
    }
  }

  blockNumbers(event: any) {
    const pattern = /[a-zA-Z ]/;
    if (!pattern.test(String.fromCharCode(event.charCode))) {
      event.preventDefault();
    }
  }

  areAllPatientsValid(): boolean {
    return this.patients.every(p => p.name && p.name.trim().length >= 2);
  }

  confirmBooking() {
    if (this.isSubmitting || !this.areAllPatientsValid()) return;
    this.isSubmitting = true;

    const formattedPatientNames = this.patients.map(p => {
      const ageGender = (p.age ? `${p.age}y` : '') + (p.gender ? `/${p.gender[0]}` : '');
      return `${p.name.trim()}${ageGender ? ' (' + ageGender + ')' : ''}`;
    }).join(', ');

    const fullAddress = `${this.address.trim()} (Pincode: ${this.pincode.trim()}, ${this.serviceLocation || 'Karnataka'})`;

    const bookingData = {
      patientName: formattedPatientNames,
      packageName: this.package.name,
      package: this.package.name,
      patientCount: this.patientCount,
      schedule: this.selectedSlot,
      hardcopy: this.hardcopy,
      email: this.email ? this.email.trim() : '',
      address: fullAddress,
      patientPhone: this.patientPhone.trim()
    };

    this.labService.saveLabBooking(bookingData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.isConfirmed = true;
        this.currentStep = 3;
        this.bookingComplete.emit(this.package.name);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Failed to save appointment:', err);
        const errMsg = err.error?.message || err.error?.error || 'Database error. Booking could not be saved.';
        alert(errMsg);
      }
    });
  }
}