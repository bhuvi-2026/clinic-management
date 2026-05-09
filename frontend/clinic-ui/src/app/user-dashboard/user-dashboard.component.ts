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
  @Output() backToHome = new EventEmitter<void>();

  bookings: any[] = [];

  constructor(private doctorService: DoctorService) {}

  ngOnInit() {
    console.log(this.email, "email id")
    if (this.email) {
      this.fetchHistory();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['email'] && this.email) {
      this.fetchHistory();
    }
  }
  
  fetchHistory() {
    this.doctorService.getBookingHistory(this.email).subscribe({
      next: (data : any) => {
        console.log("Patient History Loaded:", data);
        this.bookings = data;
      },
      error: (err : any) => console.error('Failed to load history', err)
    });
  }
}