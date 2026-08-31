import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export interface DemographicCategory {
  id: string;
  title: string;
  categoryKey: string;
  imageUrl: string;
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

  // 1. Primary Top Demographic Categories (Exact DB Tag matching)
  primaryCategories: DemographicCategory[] = [
    {
      id: 'cat_men',
      title: 'Men',
      categoryKey: 'Men',
      imageUrl: 'men.png'
    },
    {
      id: 'cat_women',
      title: 'Women',
      categoryKey: 'Women',
      imageUrl: 'women.png'
    },
    {
      id: 'cat_sr_male',
      title: 'Senior Citizen Male',
      categoryKey: 'SeniorCtznMale',
      imageUrl: 'Thaths.png'
    },
    {
      id: 'cat_sr_female',
      title: 'Senior Citizen Female',
      categoryKey: 'SeniorCtznFemale',
      imageUrl: 'ajjis.png'
    },
    {
      id: 'cat_hair_skin',
      title: 'Hair & Skin',
      categoryKey: 'HairAndSkin',
      imageUrl: 'hair_skin.png'
    },
    {
      id: 'cat_vitamins',
      title: 'Vitamins',
      categoryKey: 'Vitamins',
      imageUrl: 'Vitamin.png'
    }
  ];

  // 2. Health Concerns Horizontal Carousel (Exact DB Tag matching)
  healthConcerns: HealthConcernItem[] = [
    { id: '1', title: 'Heart', categoryKey: 'HeartCare', imageUrl: '01_Heart.png', bgClass: 'card-heart-theme' },
    { id: '2', title: 'Joint pain', categoryKey: 'JoinPain', imageUrl: '03_Joint_Pain.png', bgClass: 'card-joint-theme' },
     { id: '3', title: 'Cancer', categoryKey: 'Cancer', imageUrl: 'cancer_related_checkups.png', bgClass: 'card-cancer-theme' },
    { id: '4', title: 'Liver', categoryKey: 'Liver', imageUrl: '04_Liver.png', bgClass: 'card-liver-theme' },
    { id: '5', title: 'Lungs', categoryKey: 'Lungs', imageUrl: '05_Lungs.png', bgClass: 'card-lungs-theme' },
    { id: '6', title: 'Kidney', categoryKey: 'Kidney', imageUrl: '06_Kidney.png', bgClass: 'card-kidney-theme' },
    { id: '7', title: 'PCOD Checkup', categoryKey: 'PCODCheck', imageUrl: 'PCOD_Checkup_HD.png', bgClass: 'card-pcod-theme' },
    { id: '8', title: 'Gastric Checkup', categoryKey: 'GastricCheck', imageUrl: 'Gastric_Checkup_HD.png', bgClass: 'card-gastric-theme' },
    { id: '9', title: 'Thyroid', categoryKey: 'Thyroid', imageUrl: '02_Thyroid.png', bgClass: 'card-thyroid-theme' },
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