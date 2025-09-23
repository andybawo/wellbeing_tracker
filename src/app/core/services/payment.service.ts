import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap, catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface PaymentResponse {
  status?: boolean | string;
  success?: boolean;
  message: string;
  data:
    | {
        authorization_url?: string;
        access_code?: string;
        reference?: string;
        link?: string; // For Flutterwave
      }
    | string
    | null;
  errors?: any[];
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  initiatePayment(
    gateway: 'paystack' | 'flutterwave',
    packageId: number,
    token: string
  ): Observable<PaymentResponse> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    const baseUrl = this.apiUrl.endsWith('/')
      ? this.apiUrl.slice(0, -1)
      : this.apiUrl;
    const url = `${baseUrl}/payment/${gateway}`;

    return this.http.post<PaymentResponse>(url, packageId, { headers }).pipe(
      tap((response) =>
        console.log('Initiate Payment Success Response:', response)
      ),
      catchError((error: any) => {
        return of({
          status: false,
          success: false,
          message: `Failed to initiate payment with ${gateway}: ${
            error.message || 'Unknown error'
          }`,
          data: null,
          errors: [error.message || 'Unknown error'],
        });
      })
    );
  }
    // Get user details
  getUserDetails(token:string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.apiUrl}/api/Admin/get-user-details`,{ headers }).pipe(
      catchError((error:any)=>{
        return of({
          status:false,
          success: false,
          message:`Failed to fetch user details : ${error.message}`,
          data: null,
          errors: [error.message || 'Unknown error'],
        })
      })
    );
  }

  verifyPayment(
    transactionRef: string,
    token: string
  ): Observable<PaymentResponse> {
    let cleanRef = transactionRef?.trim();

    if (!cleanRef) {
      return of({
        status: false,
        success: false,
        message: 'Invalid transaction reference',
        data: null,
        errors: ['Invalid transaction reference'],
      });
    }

    if (cleanRef.includes(',')) {
      cleanRef = cleanRef.split(',')[0].trim();
    }

    const baseUrl = this.apiUrl.endsWith('/')
      ? this.apiUrl.slice(0, -1)
      : this.apiUrl;
    const verificationUrl = `${baseUrl}/payment/verify/${cleanRef}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http
      .post<PaymentResponse>(verificationUrl, {}, { headers })
      .pipe(
        tap((response) =>
          console.log('Payment verification response:', response)
        ),
        catchError((error) => {
          return of({
            status: false,
            success: false,
            message: `Payment verification failed: ${
              error.message || 'Unknown error'
            }`,
            data: null,
            errors: [error.message || 'Unknown error'],
          });
        })
      );
  }

  newSubscription(
    packageId: number,
    token: string
  ): Observable<PaymentResponse> {
    const baseUrl = this.apiUrl.endsWith('/')
      ? this.apiUrl.slice(0, -1)
      : this.apiUrl;
    const subscriptionUrl = `${baseUrl}/payment/newsubscription`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http
      .post(subscriptionUrl, packageId, {
        headers,
        responseType: 'text',
        observe: 'response',
      })
      .pipe(
        map((response: HttpResponse<string>) => {
          return {
            status: response.ok,
            success: response.ok,
            message: response.body || 'Subscription created successfully',
            data: null,
          } as PaymentResponse;
        }),
        catchError((error) => {
          return of({
            status: false,
            success: false,
            message: `Failed to create new subscription: ${
              error.message || 'Unknown error'
            }`,
            data: null,
            errors: [error.message || 'Unknown error'],
          });
        })
      );
  }

  verifyAndCreateSubscription(
    transactionRef: string,
    token: string,
    packageId: number
  ): Observable<PaymentResponse> {
    return this.verifyPayment(transactionRef, token).pipe(
      tap((verificationResponse) => {
        console.log('Verification response received:', verificationResponse);
      }),
      switchMap((verificationResponse: PaymentResponse) => {
        const isVerified =
          verificationResponse.success === true ||
          verificationResponse.status === true ||
          verificationResponse.status === 'true';

        if (isVerified) {
          return this.newSubscription(packageId, token);
        } else {
          return of({
            status: false,
            success: false,
            message:
              verificationResponse.message || 'Payment verification failed',
            data: null,
            errors: verificationResponse.errors || [
              'Payment verification failed',
            ],
          });
        }
      }),
      tap((finalResponse) => {
        console.log('Final response:', finalResponse);
      }),
      catchError((error) => {
        return of({
          status: false,
          success: false,
          message: `Error processing payment and subscription: ${
            error.message || 'Unknown error'
          }`,
          data: null,
          errors: [error.message || 'Unknown error'],
        });
      })
    );
  }
}
