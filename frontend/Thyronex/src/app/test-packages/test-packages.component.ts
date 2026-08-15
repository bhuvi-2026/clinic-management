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
  viewingDetailsPackage: LabPackage | null = null; 
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

  openTestDetailsModal(pkg: LabPackage): void {
    console.log('Opening test details modal for:', pkg.name);
    this.viewingDetailsPackage = pkg;
  }

  closeDetailsModal(): void {
    this.viewingDetailsPackage = null;
  }

  getTestItemsList(description: string): string[] {
    if (!description) return [];
    
    const delimiter = description.includes('\n') ? '\n' : ',';
    return description
      .split(delimiter)
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }

  bookFromDetailsModal(pkg: LabPackage): void {
    this.closeDetailsModal();
    this.bookNow(pkg);
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