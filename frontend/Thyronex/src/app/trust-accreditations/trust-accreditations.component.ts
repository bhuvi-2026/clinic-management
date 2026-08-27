import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface WorkflowCard {
  stepNumber: number;
  title: string;
  description: string;
  imageUrl: string;
}

export interface AccreditationCard {
  iconType: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  certInfo?: string;
}

@Component({
  selector: 'app-trust-accreditations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trust-accreditations.component.html',
  styleUrls: ['./trust-accreditations.component.css']
})
export class TrustAccreditationsComponent {
  // 8 Cards for "How does home sample collection work?" (4 per row on desktop)
  workflowCards: WorkflowCard[] = [
    {
      stepNumber: 1,
      title: 'Easy Online Booking & Barcoding',
      description: 'Search for tests and book your slot. A unique barcode identifier is instantly assigned to your sample to guarantee zero mix-ups.',
      imageUrl: '05_unique_barcode_tracking.png'
    },
    {
      stepNumber: 2,
      title: 'Hygienic Home Collection & Sealing',
      description: 'Certified phlebotomists collect specimens safely at your doorstep and seal them according to stringent biological preservation guidelines.',
      imageUrl: 'Hygiene_collection.svg'
    },
    {
      stepNumber: 3,
      title: 'Temperature-Controlled Logistics',
      description: 'Specimens are transported using cold-chain networks to shield biological samples against heat, time, and transit degradation.',
      imageUrl: '04_temperature.png'
    },
    {
      stepNumber: 4,
      title: '1,200+ Diagnostic Tests & Profiles',
      description: 'Extensive test menu covering routine health checkups, preventive panels, hormones, and advanced oncology markers.',
      imageUrl: '03_tests_profiles.png'
    },
    {
      stepNumber: 5,
      title: 'Fully Automated Machines Inspected Daily',
      description: 'High-throughput robotic analyzers conduct automated testing procedures with standardized daily calibration and quality control.',
      imageUrl: '06_automated_machines.png'
    },
    {
      stepNumber: 6,
      title: 'Abnormal Values Re-Checked Twice',
      description: 'Critical and abnormal test readings undergo an automatic secondary re-check to provide utmost diagnostic certainty.',
      imageUrl: '07_abnormal_values_rechecked.png'
    },
    {
      stepNumber: 7,
      title: 'Expert MD Pathologist Verification',
      description: 'Experienced on-site MD Pathologists review and clinically validate every lab finding before releasing final reports.',
      imageUrl: '08_expert_report_verification.png'
    },
    {
      stepNumber: 8,
      title: 'Fast Reports (98% Within 10 to 15 Hours)',
      description: '98% of reports are published within 10–15 hours of lab arrival, trusted by 9 out of 10 doctors across India for accuracy.',
      imageUrl: '01_reports_06_hours.png'
    }
  ];

  // Exact 3 Accreditations for "Why trust Thyronex Care?"
  accreditationCards: AccreditationCard[] = [
    {
      iconType: 'nabl',
      badge: '100% NABL Network',
      title: 'NABL & ISO 15189:2022',
      subtitle: 'Quality & Technical Competence',
      description: 'Accredited by the National Accreditation Board for Testing and Calibration Laboratories (QCI) under ISO 15189 standards.',
      certInfo: 'Cert: MC-7014 (2024–2028)'
    },
    {
      iconType: 'cap',
      badge: 'Global Gold Standard',
      title: 'CAP Accreditation',
      subtitle: 'College of American Pathologists',
      description: 'Adherence to comprehensive international laboratory quality, rigorous blind testing trials, and patient safety criteria.',
      certInfo: 'International Standard'
    },
    {
      iconType: 'iso',
      badge: 'Certified Management',
      title: 'ISO 9001:2015',
      subtitle: 'Quality Management System',
      description: 'Certified standardized operating procedures focused on total process consistency, customer satisfaction, and continuous improvement.',
      certInfo: 'Certified QMS'
    }
  ];
}