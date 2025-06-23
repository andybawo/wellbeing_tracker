import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: any[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  private isAuthenticatedUser = new BehaviorSubject<boolean>(
    this.hasValidToken()
  );
  public isAuthenticated$ = this.isAuthenticatedUser.asObservable();

  constructor(private http: HttpClient) {}

  //user sign up
  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  checkEmailExists(email: string): Observable<ApiResponse<boolean>> {
    return this.http.get<ApiResponse<boolean>>(
      `${this.apiUrl}/api/Auth/check-email?email=${encodeURIComponent(email)}`
    );
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

  isLoggedIn(): boolean {
    return this.hasValidToken();
  }

  private hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime; // Check if token is not expired
    } catch (error) {
      // If token is not a valid JWT or can't be decoded, assume it's valid
      return !!token;
    }
  }

  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userData = {
        email: payload.email,
        fullName: payload.given_name,
        // Add any other fields from the token you need
      };
      localStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.error('Error parsing token:', error);
    }

    this.isAuthenticatedUser.next(true);
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.isAuthenticatedUser.next(false);
  }
}
