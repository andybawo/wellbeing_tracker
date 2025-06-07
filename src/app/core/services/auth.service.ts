import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  //user sign up
  registerUser(userData: any): Observable<any> {
    // console.log('User data being sent to backend:', userData);

    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  loginUser(loginData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, loginData);
  }

  // Email Verification code

  sendVerification(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/email-verification/send-code`, {
      email,
    });
  }

  // Verify email from code sent
  verifyCode(email: string, verificationCode: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/email-verification/verify`, {
      email,
      verificationCode,
    });
  }

  //Company Registration
  registerCompany(companyData: { [key: string]: any }): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/Company/registerCompany`,
      companyData
    );
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/forgotpassword`, { email });
  }

  resetPassword(resetData: {
    token: string;
    email: string;
    newPassword: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/resetpassword`, resetData);
  }
}
