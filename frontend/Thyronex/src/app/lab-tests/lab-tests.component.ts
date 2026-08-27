import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LabService, HomeBasicPkg } from '../lab.service';
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

  currentSlideIndex: number = 0;
  private slideInterval: any;

  slides: PromoSlide[] = [
    {
      id: 'HOME_COLLECTION',
      badge: 'Doorstep Blood Collection',
      imageUrl: 'image-card2.png'
    },
    {
      id: 'BLOOD_TUBES',
      badge: 'Ease at your doorstep',
      imageUrl: 'image-card1.jpeg'
    },
    {
      id: 'LAB_TESTING',
      badge: 'Accurate report in 12 hours',
      imageUrl: 'image-card.jpeg'
    }
  ];

  constructor(
    private labService: LabService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadHomePackages();
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
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
    this.parsedProfiles = this.parseParametersSummary(pkg.parametersSummary);
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

        // Strip the trailing line parenthesis if it closed the profile group
        if (paramsPart.endsWith(')')) {
          paramsPart = paramsPart.substring(0, paramsPart.length - 1).trim();
        }

        // Balance opening parenthesis in the title (e.g., "(3 parameters" -> "(3 parameters)")
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