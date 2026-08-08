import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabService, LabPackage } from '../lab.service';
import { LabBookingModalComponent } from '../lab-booking-modal/lab-booking-modal.component';

@Component({
  selector: 'app-lab-tests',
  standalone: true,
  // Ensure the modal component is imported here
  imports: [CommonModule, LabBookingModalComponent], 
  templateUrl: './lab-tests.component.html',
  styleUrls: ['./lab-tests.component.css']
})
export class LabTestsComponent implements OnInit {
  packages: LabPackage[] = [];
  
  // This property controls the visibility of the popup
  selectedPackage: LabPackage | null = null; 
  @Output() loginRequired = new EventEmitter<void>();
  @Input() isLoggedIn: boolean = false;

  constructor(private labService: LabService) {}

  ngOnInit(): void {
    this.labService.getPackages().subscribe({
      next: (data) => {
        this.packages = data;
      },
      error: (err) => {
        console.error('Error fetching lab packages:', err);
      }
    });
  }

  // This is the function called by your (click)="bookNow(pkg)"
  bookNow(pkg: LabPackage) {
    console.log('Book Now clicked for package:', pkg);
    if (this.isLoggedIn) {
    this.selectedPackage = pkg; 
    }
    else {
      this.loginRequired.emit();
    }
  }

  // This handles the (closeForm) event from the modal
  closeModal() {
    this.selectedPackage = null;
  }
}