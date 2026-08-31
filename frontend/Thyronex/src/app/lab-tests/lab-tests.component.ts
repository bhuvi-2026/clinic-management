import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LabService, HomeBasicPkg, LabPackage } from '../lab.service';
import { LabBookingModalComponent } from '../lab-booking-modal/lab-booking-modal.component';

export interface PromoSlide {
  id: string;
  badge: string;
  imageUrl: string;
}

export interface ProfileGroup {
  title: string;
  isOpen: boolean;
  subParameters: string[];
}

export interface DynamicVitalCard {
  id: string;
  dbLookupKey: string;     // Exact term or fragment to find in the database package list
  displayName: string;     // Top card title
  displaySubtitle?: string;
  bgClass: string;
  pkg?: LabPackage;        // Pure DB data populated from cache
}

@Component({
  selector: 'app-lab-tests',
  standalone: true,
  imports: [CommonModule, FormsModule, LabBookingModalComponent],
  templateUrl: './lab-tests.component.html',
  styleUrls: ['./lab-tests.component.css']
})
export class LabTestsComponent implements OnInit, OnDestroy {
  @ViewChild('packagesContainer') packagesContainer!: ElementRef<HTMLDivElement>;

  @Input() isLoggedIn: boolean = false;
  @Output() loginRequired = new EventEmitter<void>();

  homePackages: HomeBasicPkg[] = [];
  selectedPackage: any = null;
  viewingDetailsPackage: any = null;
  parsedProfiles: ProfileGroup[] = [];

  // ⭐ Only identifier and styling theme are stored here - Prices & Details come 100% from DB cache
  vitalCards: DynamicVitalCard[] = [
    {
      id: 'hba1c',
      dbLookupKey: 'hba1c',
      displayName: 'HbA1c',
      displaySubtitle: '(Glycated Hemoglobin)',
      bgClass: 'vitals-card-mint'
    },
    {
      id: 'lft',
      dbLookupKey: 'liver function tests',
      displayName: 'LIVER FUNCTION TESTS',
      displaySubtitle: '(LFT - 12 Parameters)',
      bgClass: 'vitals-card-cyan'
    },
    {
      id: 'hscrp',
      dbLookupKey: 'cardiac risk markers',
      displayName: 'C-Reactive protein',
      displaySubtitle: '(Hs-CRP / Cardiac Risk)',
      bgClass: 'vitals-card-sage'
    }
  ];

  currentSlideIndex: number = 0;
  private slideInterval: any;

  slides: PromoSlide[] = [
    { id: 'HOME_COLLECTION', badge: 'Free Home Sample Collection', imageUrl: 'image-card2.png' },
    { id: 'BLOOD_TUBES', badge: '10–12 hours fasting required before testing.', imageUrl: 'image-card1.jpeg' },
    { id: 'LAB_TESTING', badge: 'Accurate Reports Within 20 to 24 Hours', imageUrl: 'image-card.jpeg' },
    { id: 'LAB_SAFETY', badge: 'Fully Automated Centralized Lab Processing', imageUrl: 'Lab_1.jpeg' }
  ];

  constructor(
    private labService: LabService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadHomePackages();
    this.fetchVitalsFromCache();
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  // ⭐ Fetch from Cache (If not cached yet, getPackages caches it automatically)
  fetchVitalsFromCache(): void {
    this.labService.getPackages('ALL').subscribe({
      next: (packages: LabPackage[]) => {
        if (packages && packages.length > 0) {
          this.vitalCards.forEach(card => {
            const found = packages.find(p => p.name.toLowerCase().includes(card.dbLookupKey.toLowerCase()));
            if (found) {
              card.pkg = found; // Direct DB package assignment
            }
          });
        }
      },
      error: (err) => console.error('Error fetching cached packages for vitals:', err)
    });
  }

  onVitalCardClick(card: DynamicVitalCard): void {
    if (!this.isLoggedIn) {
      this.loginRequired.emit();
      return;
    }

    if (card.pkg) {
      this.selectedPackage = card.pkg;
    } else {
      this.router.navigate(['/test-packages']);
    }
  }

  startAutoSlide(): void {
    this.stopAutoSlide();
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopAutoSlide(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.slideInterval = null;
    }
  }

  nextSlide(): void {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.currentSlideIndex = (this.currentSlideIndex - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number): void {
    this.currentSlideIndex = index;
    this.startAutoSlide();
  }

  loadHomePackages(): void {
    this.labService.getHomeBasicPackages().subscribe({
      next: (data) => (this.homePackages = data || []),
      error: (err) => console.error('Failed to load basic packages', err)
    });
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

  openTestDetailsModal(pkg: any): void {
    if (!this.isLoggedIn) {
      this.loginRequired.emit();
      return;
    }
    this.viewingDetailsPackage = pkg;
    this.parsedProfiles = this.parseParametersSummary(pkg.parametersSummary || pkg.description);
  }

  closeDetailsModal(): void {
    this.viewingDetailsPackage = null;
    this.parsedProfiles = [];
  }

  toggleProfile(profile: ProfileGroup): void {
    if (profile.subParameters.length > 0) {
      profile.isOpen = !profile.isOpen;
    }
  }

  parseParametersSummary(summary: string): ProfileGroup[] {
    if (!summary) return [];

    const lines = summary.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    const groups: ProfileGroup[] = [];

    for (const line of lines) {
      if (line.toLowerCase().startsWith('sample type:')) continue;

      const colonIndex = line.indexOf(':');
      if (colonIndex > -1) {
        let titlePart = line.substring(0, colonIndex).trim();
        let paramsPart = line.substring(colonIndex + 1).trim();

        if (paramsPart.endsWith(')')) {
          paramsPart = paramsPart.substring(0, paramsPart.length - 1).trim();
        }

        const openParenCount = (titlePart.match(/\(/g) || []).length;
        const closeParenCount = (titlePart.match(/\)/g) || []).length;
        if (openParenCount > closeParenCount) {
          titlePart += ')';
        }

        const paramsList = paramsPart
          .split(',')
          .map((p) => p.trim())
          .filter((p) => p.length > 0);

        groups.push({
          title: titlePart,
          isOpen: false,
          subParameters: paramsList
        });
      } else {
        groups.push({
          title: line,
          isOpen: false,
          subParameters: []
        });
      }
    }

    return groups;
  }

  bookFromDetailsModal(pkg: any): void {
    this.closeDetailsModal();
    this.onPackageClick(pkg);
  }

  onPackageClick(pkg: any): void {
    if (!this.isLoggedIn) {
      this.loginRequired.emit();
      return;
    }
    this.selectedPackage = pkg;
  }

  closeModal(): void {
    this.selectedPackage = null;
  }

  onSelectCategory(categoryType: string): void {
    if (!this.isLoggedIn) {
      this.loginRequired.emit();
      return;
    }

    this.router.navigate(['/test-packages'], {
      queryParams: { category: categoryType }
    });
  }
}