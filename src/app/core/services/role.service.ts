import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  companyRole,
  DeleteRoleResponse,
  RoleApiResponse,
} from '../../interfaces/user-interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient, private dataService: DataService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.dataService.getAuthToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  addRole(roles: Partial<companyRole>): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/Admin/add-role`, roles, {
      headers: this.getAuthHeaders(),
    });
  }

  updateRole(roles: {
    roleId: string;
    roleName: string;
    roleDescription: string;
  }): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/Admin/update-role`, roles, {
      headers: this.getAuthHeaders(),
    });
  }

  getRole(): Observable<RoleApiResponse> {
    return this.http.get<RoleApiResponse>(
      `${this.apiUrl}/api/Admin/get-all-roles`,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  getRoleById(id: string): Observable<RoleApiResponse> {
    return this.http.get<RoleApiResponse>(
      `${this.apiUrl}/api/Admin/get-role-by-id?roleId=${id}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  deleteRole(id: string): Observable<DeleteRoleResponse> {
    return this.http.delete<DeleteRoleResponse>(
      `${this.apiUrl}/api/Admin/delete-role?roleId=${id}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }
}
