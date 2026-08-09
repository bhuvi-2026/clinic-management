import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component'; // or LabTestsComponent
import { TestPackagesComponent } from './test-packages/test-packages.component';
import { authGuard } from './auth.guard';
import { LabBookingModalComponent } from './lab-booking-modal/lab-booking-modal.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'lab-modal', component: LabBookingModalComponent },
  { path: 'test-packages', component: TestPackagesComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];