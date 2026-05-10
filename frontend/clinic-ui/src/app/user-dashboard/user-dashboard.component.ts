import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../doctor.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  @Input() name: string = '';
  @Input() email: string = '';
  @Input() mobile: string = '';
  @Output() backToHome = new EventEmitter<void>();

  bookings: any[] = [];

  constructor(private doctorService: DoctorService) { }

  ngOnInit() {
    // Always check the mobile number first
    const cachedMobile = localStorage.getItem('userMobile');

    if (cachedMobile) {
      this.fetchHistory(cachedMobile);
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['mobile'] && this.mobile) {
      this.fetchHistory(this.mobile);
    }
    else if (changes['email'] && !this.mobile) {
      const cachedMobile = localStorage.getItem('userMobile');
      if (cachedMobile) {
        this.fetchHistory(cachedMobile);
      }
    }
  }

  fetchHistory(mobile: string) {
    this.doctorService.getBookingHistory(mobile).subscribe({
      next: (data) => {
        console.log("Patient History Loaded:", data);
        this.bookings = data;
        // If there are bookings, we can pull the email from the first record
        if (data.length > 0) {
          this.email = data[0].userEmail;
        }
      },
      error: (err: any) => console.error('Failed to load history', err)
    });
  }
}