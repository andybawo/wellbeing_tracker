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
    try {
      localStorage.setItem('userData', JSON.stringify(data));
    } catch (e) {
      // fallback: clear if can't save
      localStorage.removeItem('userData');
    }
  }

  getUserData(): any {
    // Always try to get from localStorage for reliability
    const storedUser = localStorage.getItem('userData');
    this.userData = storedUser ? JSON.parse(storedUser) : null;
    return this.userData;
  }

  setCompanyData(data: any) {
    this.companyData = data;

    localStorage.setItem('companyData', JSON.stringify(data));
  }

  getCompanyData(): any {
    if (!this.companyData) {
      const storedCompany = localStorage.getItem('companyData');
      this.companyData = storedCompany ? JSON.parse(storedCompany) : null;
    }
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
    localStorage.removeItem('companyData');
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
    this.authToken = token;
  }

  getAuthToken(): string | null {
    this.authToken = localStorage.getItem('authToken');
    return this.authToken;
  }
}
