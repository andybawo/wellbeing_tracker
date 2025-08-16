import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataService } from './data.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private dataService: DataService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.dataService.getAuthToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: '*/*',
    });
  }

  syncData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/syncData`, {
      headers: this.getAuthHeaders(),
    });
  }

  getProjects(range: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/projects?range=${range}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getHRM(range: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/hrm?range=${range}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getCommunication(range: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/dashboard/communication?range=${range}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  getSummary(range: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/summary?range=${range}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
