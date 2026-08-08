import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabService } from '../lab.service';

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

  constructor(private labService: LabService) { }

  ngOnInit() {
    const cachedMobile = localStorage.getItem('userMobile');

    if (cachedMobile) {
      this.fetchHistory(cachedMobile);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mobile'] && this.mobile) {
      this.fetchHistory(this.mobile);
    } else if (changes['email'] && !this.mobile) {
      const cachedMobile = localStorage.getItem('userMobile');
      if (cachedMobile) {
        this.fetchHistory(cachedMobile);
      }
    }
  }

  fetchHistory(mobile: string) {
    this.labService.getLabBookingHistory(mobile).subscribe({
      next: (data) => {
        console.log('Lab booking history loaded:', data);
        this.bookings = data;
      },
      error: (err: any) => console.error('Failed to load history', err)
    });
  }
}