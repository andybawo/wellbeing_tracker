import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  User,
  EditRequestWrapper,
  UserApiResponse,
  DeleteUserResponse,
} from '../../interfaces/user-interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataService } from './data.service';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private dataService: DataService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.dataService.getAuthToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  addUser(user: Partial<User>): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/Admin/add-user`, user, {
      headers: this.getAuthHeaders(),
    });
  }

  updateUser(payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/Admin/edit-user`, payload, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteUser(id: string): Observable<DeleteUserResponse> {
    return this.http.delete<DeleteUserResponse>(
      `${this.apiUrl}/api/Admin/remove-user`,
      {
        headers: this.getAuthHeaders(),
        body: JSON.stringify(id),
      }
    );
  }
}
