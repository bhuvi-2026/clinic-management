import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

export interface LabPackage {
  id: number;
  name: string;
  testCount: number;
  description: string;
  price: number;
  originalPrice?: number;
  fastingRequired: boolean;
  categoryTags?: string;
  detailsJson?: string;
}

export interface HomeBasicPkg {
  id?: number;
  name: string;
  testCount: number;
  discountPercentage?: number;
  parametersSummary: string;
  price: number;
  originalPrice?: number;
  fastingRequired: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LabService {
  private apiUrl = 'http://localhost:8080/api/lab-packages';
  private homeBasicApiUrl = 'http://localhost:8080/api/home-basic-pkgs';

  // In-Memory Cache
  private packagesCache: Map<string, LabPackage[]> = new Map<string, LabPackage[]>();

  constructor(private http: HttpClient) {}

  setCachedPackages(category: string, data: LabPackage[]): void {
    this.packagesCache.set(category || 'ALL', data);
  }

  getCachedPackages(category: string): LabPackage[] | undefined {
    return this.packagesCache.get(category || 'ALL');
  }

  getPackages(category?: string): Observable<LabPackage[]> {
    const key = category && category !== 'ALL' ? category : 'ALL';

    // If cache exists, return it immediately without API call
    if (this.packagesCache.has(key)) {
      return of(this.packagesCache.get(key)!);
    }

    let params = new HttpParams();
    if (category && category !== 'ALL') {
      params = params.set('category', category);
    }

    return this.http.get<LabPackage[]>(this.apiUrl, { params }).pipe(
      tap((data) => this.setCachedPackages(key, data || []))
    );
  }

  getHomeBasicPackages(): Observable<HomeBasicPkg[]> {
    return this.http.get<HomeBasicPkg[]>(this.homeBasicApiUrl);
  }

  getLabBookingHistory(mobile: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/history?mobile=${mobile}`);
  }

  saveLabBooking(bookingData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Clinic-Owner-Email': 'bhuvis459@gmail.com'
    });
    return this.http.post(`${this.apiUrl}/confirm-booking`, bookingData, { headers });
  }

  getContactInfo(): Observable<{ phone: string; inCharge: string; timings: string }> {
    return this.http.get<{ phone: string; inCharge: string; timings: string }>(`${this.apiUrl}/contact-info`);
  }
}