import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  companyDepartment,
  DepartmentApiResponse,
  DepartmentByIdApiResponse,
  CompanyUsersApiResponse,
  DeleteCompanyResponse,
} from '../../interfaces/user-interface';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataService } from './data.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private dataService: DataService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.dataService.getAuthToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  addDepartment(dept: Partial<companyDepartment>): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/Admin/add-department`, dept, {
      headers: this.getAuthHeaders(),
    });
  }

  updateDepartment(dept: {
    departmentId: string;
    departmentName: string;
    headOfDepartmentName: string;
  }): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/Admin/update-department`, dept, {
      headers: this.getAuthHeaders(),
    });
  }

  getAllDepartments(): Observable<DepartmentApiResponse> {
    return this.http.get<DepartmentApiResponse>(
      `${this.apiUrl}/api/Admin/get-all-department`,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  getDepartmentById(id: string): Observable<DepartmentByIdApiResponse> {
    return this.http.get<DepartmentByIdApiResponse>(
      `${this.apiUrl}/api/Admin/get-department?departmentId=${id}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  deleteDepartment(id: string): Observable<DeleteCompanyResponse> {
    return this.http.delete<DeleteCompanyResponse>(
      `${this.apiUrl}/api/Admin/delete-department?departmentId=${id}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  getAllCompUsers(): Observable<CompanyUsersApiResponse> {
    return this.http.get<CompanyUsersApiResponse>(
      `${this.apiUrl}/api/Admin/get-all-company-users`,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }
}
