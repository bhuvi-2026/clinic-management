import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LabBookingModalComponent } from '../lab-booking-modal/lab-booking-modal.component';

@Component({
  selector: 'app-test-packages',
  standalone: true,
  imports: [CommonModule, LabBookingModalComponent],
  templateUrl: './test-packages.component.html',
  styleUrl: './test-packages.component.css'
})
export class TestPackagesComponent implements OnInit {

  packages: any[] = [];
  selectedPackage: any = null;
  viewingDetailsPackage: any = null;
  isLoading: boolean = true;

  private API_URL = 'http://localhost:8080/api/lab-packages';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.fetchLabPackages();
  }

  fetchLabPackages(): void {
    this.isLoading = true;
    this.http.get<any[]>(this.API_URL).subscribe({
      next: (data) => {
        this.packages = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load lab packages:', err);
        this.isLoading = false;
      }
    });
  }

  openTestDetailsModal(pkg: any): void {
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

  bookFromDetailsModal(pkg: any): void {
    this.closeDetailsModal();
    this.bookNow(pkg);
  }

  bookNow(pkg: any): void {
    this.selectedPackage = pkg;
  }

  closeModal(): void {
    this.selectedPackage = null;
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}