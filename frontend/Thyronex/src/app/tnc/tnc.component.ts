import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-tnc',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tnc.component.html',
  styleUrls: ['./tnc.component.css']
})
export class TermsAndConditionsComponent implements OnInit {
  lastUpdated: string = 'March 2026';
  
  // ⭐ Boolean flag to toggle between Terms & Conditions and About Us
  isAboutUsTab: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Detect whether the current route or query is 'about-us'
    this.route.url.subscribe(urlSegments => {
      const path = urlSegments.map(s => s.path).join('/');
      this.isAboutUsTab = path.includes('about-us');
    });

    this.route.queryParams.subscribe(params => {
      if (params['tab'] === 'about') {
        this.isAboutUsTab = true;
      }
    });

    // Scroll smoothly to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  setTab(isAbout: boolean): void {
    this.isAboutUsTab = isAbout;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}