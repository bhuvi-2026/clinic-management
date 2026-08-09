import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabService, LabPackage } from '../lab.service';
import { LabBookingModalComponent } from '../lab-booking-modal/lab-booking-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lab-tests',
  standalone: true,
  imports: [CommonModule, LabBookingModalComponent], 
  templateUrl: './lab-tests.component.html',
  styleUrls: ['./lab-tests.component.css']
})
export class LabTestsComponent implements OnInit {
  packages: LabPackage[] = [];
  selectedPackage: LabPackage | null = null; 

  @Input() isLoggedIn: boolean = false;
  @Output() loginRequired = new EventEmitter<void>();
  @Output() categorySelected = new EventEmitter<string>();
  @ViewChild('packagesContainer') packagesContainer!: ElementRef;

  constructor(private labService: LabService, private router: Router) {}

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

  // Handle Category Card Click
  onSelectCategory(category: string): void {
    if (this.isLoggedIn) {
      this.router.navigate(['/test-packages']);
    } else {
      this.loginRequired.emit();
    }
  }

  // Handle Package Card "Book Test" / "Add" Click
  onPackageClick(pkg?: any): void {
    if (this.isLoggedIn) {
      this.selectedPackage = pkg;
      
    } else {
      // User is not logged in -> Trigger Login Modal
      this.loginRequired.emit();
    }
  }

  scrollLeft(): void {
    if (this.packagesContainer) {
      this.packagesContainer.nativeElement.scrollBy({ left: -340, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.packagesContainer) {
      this.packagesContainer.nativeElement.scrollBy({ left: 340, behavior: 'smooth' });
    }
  }

  closeModal() {
    this.selectedPackage = null;
  }
}