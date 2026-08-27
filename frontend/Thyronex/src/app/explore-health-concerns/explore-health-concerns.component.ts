import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export interface DemographicCategory {
  id: string;
  title: string;
  categoryKey: string;
  imageUrl: string; // Add your image URL here (e.g. 'assets/images/men.png')
  badgeText?: string;
}

export interface HealthConcernItem {
  id: string;
  title: string;
  categoryKey: string;
  imageUrl: string;
  bgClass: string;
}

@Component({
  selector: 'app-explore-health-concerns',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './explore-health-concerns.component.html',
  styleUrls: ['./explore-health-concerns.component.css']
})
export class ExploreHealthConcernsComponent {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  @Input() isLoggedIn: boolean = false;
  @Output() loginRequired = new EventEmitter<void>();

  // 1. Primary Top Categories matching the 1st reference image style
  primaryCategories: DemographicCategory[] = [
    {
      id: 'cat_men',
      title: 'Men',
      categoryKey: 'MEN_HEALTH',
      imageUrl: 'men.png' // Add your image source path
    },
    {
      id: 'cat_women',
      title: 'Women',
      categoryKey: 'WOMEN_HEALTH',
      imageUrl: 'women.png' // Add your image source path
    },
    {
      id: 'cat_sr_male',
      title: 'Senior Citizen Male',
      categoryKey: 'SENIOR_CITIZEN_MALE',
      imageUrl: 'Thaths.png' // Add your image source path
    },
    {
      id: 'cat_sr_female',
      title: 'Senior Citizen Female',
      categoryKey: 'SENIOR_CITIZEN_FEMALE',
      imageUrl: 'ajjis.png' // Add your image source path
    },
    {
      id: 'cat_hair_skin',
      title: 'Hair & Skin',
      categoryKey: 'HAIR_SKIN',
      imageUrl: 'hair_skin.png' // Add your image source path
    }
  ];

  // 2. Health Concerns Horizontal Carousel
  healthConcerns: HealthConcernItem[] = [
    { id: '1', title: 'Heart', categoryKey: 'HEART_HEALTH', imageUrl: '01_Heart.png', bgClass: 'card-heart-theme' },
    { id: '2', title: 'Thyroid', categoryKey: 'THYROID_PROFILE', imageUrl: '02_Thyroid.png', bgClass: 'card-thyroid-theme' },
    { id: '3', title: 'Joint pain', categoryKey: 'BONE_PROFILE', imageUrl: '03_Joint_Pain.png', bgClass: 'card-joint-theme' },
    { id: '4', title: 'Liver', categoryKey: 'LIVER_CARE', imageUrl: '04_Liver.png', bgClass: 'card-liver-theme' },
    { id: '5', title: 'Lungs', categoryKey: 'LUNGS_CARE', imageUrl: '05_Lungs.png', bgClass: 'card-lungs-theme' },
    { id: '6', title: 'Kidney', categoryKey: 'KIDNEY_CARE', imageUrl: '06_Kidney.png', bgClass: 'card-kidney-theme' },
    { id: '7', title: 'PCOD Checkup', categoryKey: 'WOMEN_HEALTH', imageUrl: 'PCOD_Checkup_HD.png', bgClass: 'card-pcod-theme' },
    { id: '8', title: 'Gastric Checkup', categoryKey: 'GASTRO_CARE', imageUrl: 'Gastric_Checkup_HD.png', bgClass: 'card-gastric-theme' }
  ];

  constructor(private router: Router) {}

  scrollLeft(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({ left: -260, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({ left: 260, behavior: 'smooth' });
    }
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