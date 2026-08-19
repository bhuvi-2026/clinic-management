import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TestPackagesComponent } from './test-packages/test-packages.component';
import { authGuard } from './auth.guard';
import { LabBookingModalComponent } from './lab-booking-modal/lab-booking-modal.component';
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'lab-modal', component: LabBookingModalComponent },
  { path: 'test-packages', component: TestPackagesComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminComponent }, // Admin management URL (Hidden from normal UI)
  { path: '**', redirectTo: '' }
];