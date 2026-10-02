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

  // 1. Rich Categorized Image Pools with High Visual Variety
  private readonly categorizedImagePool: Record<string, string[]> = {
    HeartCare: [
      'healthcare_image_33.png', // Stethoscope with Red Heart
      'healthcare_image_32.png', // Digital BP Monitor on Patient Arm
      '07_heart_health_checkup.png', // Heart Checkup Banner
      'healthcare_image_08.png', // Friendly Doctor Consultation
      'healthcare_image_12.png', // Arm Venipuncture Blood Draw
      'healthcare_image_39.png'  // Barcoded Blood Vacutainer
    ],
    Diabetic: [
      'healthcare_image_15.png', // Glucometer Blood Sugar Test
      'healthcare_image_28.png', // Home Phlebotomist Collecting Sample
      'healthcare_image_11.png', // Rack of Vacutainer Tubes
      '06_diabetes_screening.png', // Diabetes Screening Illustration
      'healthcare_image_31.png', // Automated Lab Analyzer
      'healthcare_image_02.png'  // Nurse Drawing Blood
    ],
    Women: [
      'healthcare_image_22.png', // Female Doctor Consulting Female Patient
      '04_womens_health_checkup.png', // Woman Checking Face/Skin
      'healthcare_image_35.png', // Yoga / Women's Fitness
      'healthcare_image_09.png', // Smiling Female Doctor with Digital Tablet
      'healthcare_image_28.png'  // Female Patient Sample Collection
    ],
    Men: [
      'healthcare_image_03.png', // Confident Smiling Men / Wellness
      '05_mens_health_checkup.png', // Men's Health Checkup
      'healthcare_image_08.png', // Male Doctor Consultation
      'healthcare_image_25.png', // Male Doctor Writing Prescription
      'healthcare_image_02.png'  // Male Patient Getting Blood Drawn
    ],
    SeniorCtznMale: [
      'healthcare_image_36.png', // Happy Senior Couple
      '03_senior_citizen_health_checkup.png',
      'leasure-activities-for-elderly-Df1-1.jpeg',
      'healthcare_image_08.png'
    ],
    SeniorCtznFemale: [
      'healthcare_image_36.png', // Happy Senior Couple
      '03_senior_citizen_health_checkup.png',
      'leasure-activities-for-elderly-Df1-1.jpeg',
      'healthcare_image_22.png'
    ],
    Cancer: [
      'cancer_related_checkups.png',
      '08_cancer_screening.png',
      'healthcare_image_06.png', // Clinical Pathologist with Microscope
      'healthcare_image_26.png', // Slide Cell Examination
      'healthcare_image_31.png'
    ],
    Thyroid: [
      'healthcare_image_16.png', // Barcoded Specimen Tube
      'healthcare_image_10.png', // Barcode Scanner on Specimen
      'healthcare_image_31.png', // Analyzer Equipment
      'healthcare_image_07.png', // Pipetting Serum Droplets
      'healthcare_image_18.png'
    ],
    Liver: [
      'healthcare_image_19.png', // Centrifuge Serum Separation
      'healthcare_image_20.png', // Lab Tech Sorting Vials
      'healthcare_image_24.png', // Reagent Flask Chemical Test
      'healthcare_image_05.png'
    ],
    Kidney: [
      'healthcare_image_13.png', // Sterile Urine Sample Container
      'healthcare_image_27.png', // Multi-Tube Stand
      'healthcare_image_04.png',
      'healthcare_image_11.png'
    ],
    Vitamins: [
      'healthcare_image_38.png', // Vaccine / Vitamin Vial & Syringe
      'healthcare_image_17.png', // Injection Administration
      'healthcare_image_30.png', // Chemist Handling Vials
      'healthcare_image_18.png'
    ],
    FullBody: [
      '01_comprehensive_health_checkup.png',
      'healthcare_image_40.png', // Full Happy Multi-Gen Family
      '02_advanced_full_body_checkup.png',
      'healthcare_image_23.png', // Young Nuclear Family
      'healthcare_image_08.png',
      'healthcare_image_25.png'
    ],
    JoinPain: [
      'healthcare_image_32.png',
      'healthcare_image_18.png',
      'healthcare_image_28.png'
    ],
    HairAndSkin: [
      'healthcare_image_35.png',
      'healthcare_image_22.png',
      '04_womens_health_checkup.png'
    ],
    GastricCheck: [
      'healthcare_image_19.png',
      'healthcare_image_24.png',
      'healthcare_image_20.png'
    ],
    Lungs: [
      'healthcare_image_21.png', // Culture / Pipette Analysis
      'healthcare_image_12.png',
      'healthcare_image_39.png'
    ]
  };

  private readonly generalPool: string[] = [
    'healthcare_image_01.png',
    'healthcare_image_02.png',
    'healthcare_image_08.png',
    'healthcare_image_10.png',
    'healthcare_image_23.png',
    'healthcare_image_27.png',
    'healthcare_image_28.png',
    'healthcare_image_31.png',
    'healthcare_image_40.png'
  ];

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
    'LUNGS_CARE': 'Lungs',
    'CancerCheck': 'Cancer',
    'CANCER': 'Cancer'
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private labService: LabService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const rawCategory = params['category'] || 'ALL';
      this.selectedCategory = this.aliasMap[rawCategory] || rawCategory;
      this.categoryTitle = this.categoryMap[this.selectedCategory] || 'Diagnostic Test Packages';
      this.fetchLabPackages();

      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
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

  // ⭐ Strictly Priority-Checked Image Resolver (No demographic overwrites & No repetitions)
  getPackageImage(pkg: LabPackage, index: number): string {
    const name = (pkg.name || '').toLowerCase();
    const tag = (pkg.categoryTags || '').trim();

    // 1. PRIORITY 1: MEN PACKAGES (Strictly Men/Doctors only, even if test mentions cancer/hormones)
    if (tag === 'Men' || name.startsWith('men ') || name.includes('for men') || name.includes("men's")) {
      const pool = this.categorizedImagePool['Men'];
      return pool[index % pool.length];
    }

    // 2. PRIORITY 2: WOMEN PACKAGES (Strictly Women/Female consultation, even if test mentions cancer)
    if (tag === 'Women' || tag === 'PCODCheck' || name.startsWith('women') || name.includes('for women') || name.includes("women's")) {
      const pool = this.categorizedImagePool['Women'];
      return pool[index % pool.length];
    }

    // 3. PRIORITY 3: SENIOR CITIZENS (Strictly Senior couples/elderly care)
    if (tag.includes('SeniorCtzn') || name.includes('senior citizen')) {
      const pool = tag === 'SeniorCtznFemale' ? this.categorizedImagePool['SeniorCtznFemale'] : this.categorizedImagePool['SeniorCtznMale'];
      return pool[index % pool.length];
    }

    // 4. PRIORITY 4: URINE SPECIFIC TESTS (Show urine sample cup)
    if (name.includes('urine') || name.includes('urinalysis')) {
      return 'healthcare_image_13.png';
    }

    // 5. PRIORITY 5: PURE CANCER PACKAGES (Only when it is genuinely a cancer screening package)
    if (tag === 'Cancer' || (name.includes('cancer') && !name.includes('women') && !name.includes('men'))) {
      const pool = this.categorizedImagePool['Cancer'];
      return pool[index % pool.length];
    }

    // 6. PRIORITY 6: CATEGORY POOL CYCLING (Ensures 5-6 different images in Heart, Diabetes, Thyroid, Liver)
    if (tag && this.categorizedImagePool[tag]) {
      const pool = this.categorizedImagePool[tag];
      return pool[index % pool.length];
    }

    // 7. General Fallback
    return this.generalPool[(index + (pkg.id || 0)) % this.generalPool.length];
  }

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