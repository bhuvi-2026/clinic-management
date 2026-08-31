import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {
  lastUpdated: string = 'August 2026';

  // ⭐ Boolean flag to toggle between Privacy Policy & Contact Us
  isContactUsTab: boolean = false;

  // Contact enquiry form model
  contactForm = {
    name: '',
    email: '',
    mobile: '',
    message: ''
  };


  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Detect if accessed via /contact-us or /privacy-policy
    this.route.url.subscribe(urlSegments => {
      const path = urlSegments.map(s => s.path).join('/');
      this.isContactUsTab = path.includes('contact-us');
    });

    this.route.queryParams.subscribe(params => {
      if (params['tab'] === 'contact') {
        this.isContactUsTab = true;
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  setTab(isContact: boolean): void {
    this.isContactUsTab = isContact;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}