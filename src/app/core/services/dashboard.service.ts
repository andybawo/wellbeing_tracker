import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataService } from './data.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  summaryCache: any = null;
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

  getProjectDetails(id: number, range: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/dashboard/projects/${id}?range=${range}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
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

  getSummaryCached(range: number): Observable<any> {
    if (this.summaryCache) {
      return new Observable((observer) => {
        observer.next({ success: true, data: this.summaryCache });
        observer.complete();
      });
    }
    return new Observable((observer) => {
      this.getSummary(range).subscribe({
        next: (res) => {
          if (res && res.success) {
            this.summaryCache = res.data;
          }
          observer.next(res);
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        },
      });
    });
  }

  // refreshAllDashboardData(range: number = 2): Observable<any> {
  //   return new Observable((observer) => {
  //     this.syncData().subscribe({
  //       next: () => {
  //         const results: any = {};
  //         let completed = 0;
  //         const total = 4;

  //         this.getProjects(range).subscribe(
  //           (res) => {
  //             results.projects = res;
  //             if (++completed === total) observer.next(results);
  //           },
  //           (err) => {
  //             results.projects = null;
  //             if (++completed === total) observer.next(results);
  //           }
  //         );

  //         this.getHRM(range).subscribe(
  //           (res) => {
  //             results.hrm = res;
  //             if (++completed === total) observer.next(results);
  //           },
  //           (err) => {
  //             results.hrm = null;
  //             if (++completed === total) observer.next(results);
  //           }
  //         );

  //         this.getCommunication(range).subscribe(
  //           (res) => {
  //             results.communication = res;
  //             if (++completed === total) observer.next(results);
  //           },
  //           (err) => {
  //             results.communication = null;
  //             if (++completed === total) observer.next(results);
  //           }
  //         );

  //         this.getSummary(range).subscribe(
  //           (res) => {
  //             results.summary = res;
  //             if (++completed === total) observer.next(results);
  //           },
  //           (err) => {
  //             results.summary = null;
  //             if (++completed === total) observer.next(results);
  //           }
  //         );
  //       },
  //       error: (err) => {
  //         observer.error(err);
  //       },
  //     });
  //   });
  // }

  clearCache() {
    this.summaryCache = null;
  }
}
