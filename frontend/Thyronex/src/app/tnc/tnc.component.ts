import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tnc',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tnc.component.html',
  styleUrls: ['./tnc.component.css']
})
export class TermsAndConditionsComponent implements OnInit {
  lastUpdated: string = 'March 2026';

  ngOnInit(): void {
    // Scroll smoothly to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}