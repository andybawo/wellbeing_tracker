import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap, catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { PaymentResponse } from '../../interfaces/payment-response';

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

    console.log('Initiating payment:', { gateway, packageId, url });

    return this.http.post<PaymentResponse>(url, packageId, { headers }).pipe(
      tap((response) =>
        console.log('Initiate Payment Success Response:', response)
      ),
      catchError((error: any) => {
        console.error('Initiate Payment Error:', error);
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

    // Add extensive debugging
    console.log('=== NEW SUBSCRIPTION DEBUG ===');
    console.log('PackageId:', packageId, 'Type:', typeof packageId);
    console.log('Token:', token ? 'Present' : 'Missing');
    console.log('URL:', subscriptionUrl);
    console.log('Headers:', headers);
    console.log('Request Body:', packageId);
    console.log('==============================');

    return this.http
      .post<PaymentResponse>(subscriptionUrl, packageId, {
        headers,
        // Add observe: 'response' to see full HTTP response
        observe: 'response',
      })
      .pipe(
        map((httpResponse: any) => {
          console.log('Full HTTP Response:', httpResponse);
          return httpResponse.body;
        }),
        tap((response) => {
          console.log('New subscription success response:', response);
        }),
        catchError((error) => {
          console.error('=== NEW SUBSCRIPTION ERROR ===');
          console.error('Full error object:', error);
          console.error('Error status:', error.status);
          console.error('Error statusText:', error.statusText);
          console.error('Error headers:', error.headers);
          console.error('Error body:', error.error);
          console.error('Error message:', error.message);
          console.error('Error url:', error.url);
          console.error('==============================');

          let errorMessage = 'Unknown error';
          if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          }

          return of({
            status: false,
            success: false,
            message: `Failed to create new subscription: ${errorMessage}`,
            data: null,
            errors: [errorMessage],
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

  extendSubscription(
    packageId: number,
    token: string
  ): Observable<PaymentResponse> {
    const baseUrl = this.apiUrl.endsWith('/')
      ? this.apiUrl.slice(0, -1)
      : this.apiUrl;
    const extensionUrl = `${baseUrl}/payment/extendsubscription`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http
      .post<PaymentResponse>(extensionUrl, packageId, { headers })
      .pipe(
        catchError((error) => {
          return of({
            status: false,
            success: false,
            message: `Failed to extend subscription: ${
              error.message || 'Unknown error'
            }`,
            data: null,
            errors: [error.message || 'Unknown error'],
          });
        })
      );
  }

  verifyAndExtendSubscription(
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
          return this.extendSubscription(packageId, token);
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
          message: `Error processing payment and extension: ${
            error.message || 'Unknown error'
          }`,
          data: null,
          errors: [error.message || 'Unknown error'],
        });
      })
    );
  }
}
