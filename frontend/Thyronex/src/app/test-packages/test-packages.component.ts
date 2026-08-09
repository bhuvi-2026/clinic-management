import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LabService, LabPackage } from '../lab.service';
import { LabBookingModalComponent } from '../lab-booking-modal/lab-booking-modal.component';

@Component({
  selector: 'app-test-packages',
  standalone: true,
  imports: [CommonModule, LabBookingModalComponent],
  templateUrl: './test-packages.component.html',
  styleUrls: ['./test-packages.component.css']
})
export class TestPackagesComponent implements OnInit {

  packages: LabPackage[] = [];
  selectedPackage: LabPackage | null = null;
  isLoading: boolean = true;

  constructor(
    private labService: LabService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchPackagesFromApi();
  }

  fetchPackagesFromApi(): void {
    this.isLoading = true;
    this.labService.getPackages().subscribe({
      next: (data: LabPackage[]) => {
        console.log('Fetched packages from DB:', data);
        this.packages = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching lab packages:', err);
        this.packages = [];
        this.isLoading = false;
      }
    });
  }

  bookNow(pkg: LabPackage): void {
    this.selectedPackage = pkg;
  }

  closeModal(): void {
    this.selectedPackage = null;
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}