import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PackagesService {
  private apiUrl = environment.apiUrl;
  private packageId: number | null = null;

  constructor(private http: HttpClient) {}

  getPackages(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/Package/packages`);
  }

  getPackagesById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/Package/packages${id}`);
  }

  setPackageId(id: number): void {
    this.packageId = id;
  }

  getPackageId(): number | null {
    return this.packageId;
  }
}
