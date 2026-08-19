import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LabService, HomeBasicPkg } from '../lab.service';
import { LabBookingModalComponent } from '../lab-booking-modal/lab-booking-modal.component';

export interface PromoSlide {
  id: string;
  badge: string;
  title: string;
  desc: string;
  imageUrl: string;
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

  homePackages: HomeBasicPkg[] = [];
  selectedPackage: any = null;
  viewingDetailsPackage: any = null;
  @Input() isLoggedIn: boolean = false;
  @Output() loginRequired = new EventEmitter<void>();

  // Auto Slider State (Transitions every 5 seconds)
  currentSlideIndex: number = 0;
  private slideInterval: any;

  // 3 Realistic Medical Photography Slides
  slides: PromoSlide[] = [
    {
      id: 'HOME_COLLECTION',
      badge: '⚡ 60-Mins Sample Pickup',
      title: 'Doorstep Blood Collection',
      desc: 'Trained & vaccinated medical phlebotomists arriving directly at your home with sterile vacutainers',
      imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 'BLOOD_TUBES',
      badge: '🧪 100% Sterile & Cold-Chain',
      title: 'Barcoded Pathology Vials',
      desc: 'Color-coded vacuum collection tubes preserved in strict temperature-controlled logistics',
      imageUrl: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 'LAB_TESTING',
      badge: '🔬 NABL & CAP Accredited',
      title: 'Precision Clinical Diagnostics',
      desc: 'Fully automated biochemistry analyzers delivering certified test reports within 11 hours',
      imageUrl: 'https://images.unsplash.com/photo-1579165466741-7f35e4755660?auto=format&fit=crop&w=900&q=80'
    }
  ];

  constructor(private labService: LabService) {}

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
    }, 5000); // 5 Seconds Auto-Slide
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
    this.startAutoSlide(); // Reset 5s countdown on manual click
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
    this.viewingDetailsPackage = pkg;
  }

  closeDetailsModal(): void {
    this.viewingDetailsPackage = null;
  }

  bookFromDetailsModal(pkg: any): void {
    this.closeDetailsModal();
    this.onPackageClick(pkg);
  }

  onPackageClick(pkg: any): void {
    this.selectedPackage = pkg;
  }

  closeModal(): void {
    this.selectedPackage = null;
  }

  getTestItemsList(summary: string): string[] {
    if (!summary) return [];
    return summary.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
  }

  onSelectCategory(categoryType: string): void {
    console.log('Category selected:', categoryType);
  }
}