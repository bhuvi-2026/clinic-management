import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabService, HomeBasicPkg, LabPackage } from '../lab.service';
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
  homePackages: HomeBasicPkg[] = [];
  selectedPackage: LabPackage | null = null; 

  @Input() isLoggedIn: boolean = false;
  @Output() loginRequired = new EventEmitter<void>();
  @Output() categorySelected = new EventEmitter<string>();
  @ViewChild('packagesContainer') packagesContainer!: ElementRef;

  constructor(private labService: LabService, private router: Router) {}

  ngOnInit(): void {
    this.fetchHomeBasicPackages();
  }

  fetchHomeBasicPackages(): void {
    this.labService.getHomeBasicPackages().subscribe({
      next: (data: HomeBasicPkg[]) => {
        this.homePackages = data;
      },
      error: (err) => {
        console.error('Error fetching home basic packages:', err);
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

  // Handle Package Card "Book Test" Click
  onPackageClick(pkg: HomeBasicPkg): void {
    if (this.isLoggedIn) {
      // Map HomeBasicPkg object to LabPackage format expected by booking modal
      this.selectedPackage = {
        id: pkg.id || 0,
        name: pkg.name,
        testCount: pkg.testCount,
        description: pkg.parametersSummary,
        price: pkg.price,
        originalPrice: pkg.originalPrice,
        fastingRequired: pkg.fastingRequired
      };
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

  closeModal(): void {
    this.selectedPackage = null;
  }
}