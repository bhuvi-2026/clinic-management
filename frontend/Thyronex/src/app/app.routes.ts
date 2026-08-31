import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TestPackagesComponent } from './test-packages/test-packages.component';
import { authGuard } from './auth.guard';
import { LabBookingModalComponent } from './lab-booking-modal/lab-booking-modal.component';
import { AdminComponent } from './admin/admin.component';
import { TermsAndConditionsComponent } from './tnc/tnc.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'lab-modal', component: LabBookingModalComponent },
  { path: 'test-packages', component: TestPackagesComponent, canActivate: [authGuard] },
  { path: 'dashboard', component: UserDashboardComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminComponent }, // Admin management URL (Hidden from normal UI)
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'terms-and-conditions', component: TermsAndConditionsComponent },
  { path: 'about-us', component: TermsAndConditionsComponent },
  { path: 'contact-us', component: PrivacyPolicyComponent },
  { path: 'Tnc', redirectTo: 'terms-and-conditions', pathMatch: 'full' }, 
  { path: '**', redirectTo: '' }
];