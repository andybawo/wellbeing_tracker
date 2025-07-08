import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private userData: any = null;
  private companyData: any = null;
  private authToken: string | null = null;

  setUserData(data: any) {
    this.userData = data;
    localStorage.setItem('userData', JSON.stringify(data));
  }

  getUserData(): any {
    if (!this.userData) {
      const storedUser = localStorage.getItem('userData');
      this.userData = storedUser ? JSON.parse(storedUser) : null;
    }
    return this.userData;
  }

  setCompanyData(data: any) {
    this.companyData = data;
  }

  getCompanyData(): any {
    return this.companyData;
  }

  setHasRegisteredUser(status: boolean) {
    localStorage.setItem('hasRegisteredUser', JSON.stringify(status));
  }

  getHasRegisteredUser(): boolean {
    return JSON.parse(localStorage.getItem('hasRegisteredUser') || 'false');
  }

  getCurrentUserEmail(): string | null {
    const userData = this.getUserData();
    return userData ? userData.email : null;
  }

  clearData() {
    this.userData = null;
    this.companyData = null;
    localStorage.removeItem('hasRegisteredUser');
    this.authToken = null;
    localStorage.removeItem('userData');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('fullName');
    localStorage.removeItem('hasRegisteredUser');
    localStorage.removeItem('resetEmail');
    localStorage.removeItem('authToken');
    localStorage.removeItem('seamlessHR_integrated');
    localStorage.removeItem('slack_integrated');
    localStorage.removeItem('jira_integrated');
    // localStorage.removeItem('outlook_integrated');
    // localStorage.removeItem('teams_integrated');
    // localStorage.removeItem('planner_integrated');
  }

  setAuthToken(token: string) {
    localStorage.setItem('authToken', token);
    this.authToken = token; // Keep the property updated for in-memory access
  }

  getAuthToken(): string | null {
    this.authToken = localStorage.getItem('authToken'); //check local storage
    return this.authToken;
  }
}
