import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LabService, LabPackage } from '../lab.service';
import { LabBookingModalComponent } from '../lab-booking-modal/lab-booking-modal.component';

export interface ProfileGroup {
  title: string;
  isOpen: boolean;
  subParameters: string[];
}

@Component({
  selector: 'app-test-packages',
  standalone: true,
  imports: [CommonModule, LabBookingModalComponent],
  templateUrl: './test-packages.component.html',
  styleUrls: ['./test-packages.component.css']
})
export class TestPackagesComponent implements OnInit {

  packages: LabPackage[] = [];
  selectedPackage: any = null;
  viewingDetailsPackage: any = null;
  parsedProfiles: ProfileGroup[] = [];
  isLoading: boolean = true;
  selectedCategory: string = 'ALL';
  categoryTitle: string = 'All Diagnostic Packages';

  private readonly imagePool = {
    heart: [
      '07_heart_health_checkup.png',
      '01_comprehensive_health_checkup.png',
      'adult_man_thumbs_up_HD.png',
      'technician_blood_sample_hd.png',
      '02_advanced_full_body_checkup.png'
    ],
    senior: [
      '03_senior_citizen_health_checkup.png',
      'leasure-activities-for-elderly-Df1-1.jpeg',
      '01_comprehensive_health_checkup.png',
      'medical_blood_collection_hd.png'
    ],
    women: [
      '04_womens_health_checkup.png',
      'adult_woman_pointing_HD.png',
      '01_comprehensive_health_checkup.png',
      'lab_scientist_blood_sample_hd.png'
    ],
    men: [
      '05_mens_health_checkup.png',
      'adult_man_thumbs_up_HD.png',
      'adult_man_arms_crossed_HD.png',
      'technician_blood_sample_hd.png'
    ],
    diabetes: [
      '06_diabetes_screening.png',
      'blood_tube_closeup_hd.png',
      '01_comprehensive_health_checkup.png',
      'adult_woman_pointing_HD.png'
    ],
    cancer: [
      '08_cancer_screening.png',
      'lab_scientist_blood_sample_hd.png',
      'blood_tube_closeup_hd.png',
      '02_advanced_full_body_checkup.png'
    ],
    general: [
      '01_comprehensive_health_checkup.png',
      '02_advanced_full_body_checkup.png',
      'medical_blood_collection_hd.png',
      'technician_blood_sample_hd.png',
      'lab_scientist_blood_sample_hd.png',
      'adult_man_thumbs_up_HD.png',
      'adult_woman_pointing_HD.png',
      'adult_man_arms_crossed_HD.png'
    ]
  };

  private readonly categoryMap: Record<string, string> = {
    'ALL': 'All Diagnostic Packages',
    'FullBody': 'Full Body Health Checkup Packages',
    'Thyroid': 'Thyroid Care Profiles & Packages',
    'HeartCare': 'Heart & Cardiac Care Packages',
    'Diabetic': 'Diabetes Checkup Packages',
    'Men': 'Men\'s Health Checkups',
    'Women': 'Women\'s Health & Wellness Packages',
    'SeniorCtznMale': 'Senior Citizen (Male) Checkups',
    'SeniorCtznFemale': 'Senior Citizen (Female) Checkups',
    'HairAndSkin': 'Hair & Skin Vital Profiles',
    'Vitamins': 'Vitamin & Nutrition Profiles',
    'JoinPain': 'Bone & Joint Pain Packages',
    'Liver': 'Liver Health & Function Packages',
    'Kidney': 'Kidney & Renal Health Packages',
    'PCODCheck': 'PCOD & Hormonal Profiles',
    'GastricCheck': 'Gastro & Digestion Checkups',
    'Cancer': 'Cancer Screening Packages',
    'Lungs': 'Lungs & Respiratory Packages'
  };

  private readonly aliasMap: Record<string, string> = {
    'FULL_BODY': 'FullBody',
    'HEART_HEALTH': 'HeartCare',
    'DIABETIC_CARE': 'Diabetic',
    'THYROID_PROFILE': 'Thyroid',
    'MEN_HEALTH': 'Men',
    'WOMEN_HEALTH': 'Women',
    'SENIOR_CITIZEN_MALE': 'SeniorCtznMale',
    'SENIOR_CITIZEN_FEMALE': 'SeniorCtznFemale',
    'BONE_PROFILE': 'JoinPain',
    'LIVER_CARE': 'Liver',
    'KIDNEY_CARE': 'Kidney',
    'HAIR_SKIN': 'HairAndSkin',
    'PCOD': 'PCODCheck',
    'GASTRO_CARE': 'GastricCheck',
    'LUNGS_CARE': 'Lungs'
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private labService: LabService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let rawCategory = params['category'] || 'ALL';
      this.selectedCategory = this.aliasMap[rawCategory] || rawCategory;
      this.categoryTitle = this.categoryMap[this.selectedCategory] || 'Diagnostic Test Packages';
      this.fetchLabPackages();
    });
  }

  fetchLabPackages(): void {
    this.isLoading = true;
    this.labService.getPackages(this.selectedCategory).subscribe({
      next: (data) => {
        this.packages = data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load lab packages:', err);
        this.isLoading = false;
      }
    });
  }

  getPackageImage(pkg: LabPackage, index: number): string {
    const name = (pkg.name || '').toLowerCase();
    const tags = (pkg.categoryTags || '').toLowerCase();
    const hash = (index * 7 + name.length + (pkg.id || 1)) % 100;

    let pool = this.imagePool.general;

    if (name.includes('senior') || tags.includes('seniorctzn')) {
      pool = this.imagePool.senior;
    } else if (name.includes('women') || tags.includes('women') || tags.includes('pcod')) {
      pool = this.imagePool.women;
    } else if (name.includes('men') || tags.includes('men')) {
      pool = this.imagePool.men;
    } else if (name.includes('heart') || name.includes('cardiac') || tags.includes('heartcare') || name.includes('troponin')) {
      pool = this.imagePool.heart;
    } else if (name.includes('diabet') || name.includes('sugar') || tags.includes('diabetic') || name.includes('insulin')) {
      pool = this.imagePool.diabetes;
    } else if (name.includes('cancer') || tags.includes('cancer') || name.includes('psa') || name.includes('cea')) {
      pool = this.imagePool.cancer;
    }

    return pool[hash % pool.length];
  }

  // ⭐ Calculates exact integer discount percentage using Math.floor
  getDiscountPercent(pkg: LabPackage): number {
    if (pkg.originalPrice && pkg.originalPrice > pkg.price) {
      return Math.floor(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100);
    }
    return 0;
  }

  openTestDetailsModal(pkg: LabPackage): void {
    this.viewingDetailsPackage = pkg;
    this.parsedProfiles = this.parseParametersSummary(pkg.description);
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